import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get('error_description') || 'Authentication failed'
      console.error('Meta OAuth error:', error, errorDescription)
      
      // Redirect to onboarding with error
      return NextResponse.redirect(
        new URL(`/onboarding?error=${encodeURIComponent(errorDescription)}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/onboarding?error=Invalid authentication response', request.url)
      )
    }

    // Parse state to get session info
    const [sessionId, businessId] = state.split(':')

    if (!sessionId) {
      return NextResponse.redirect(
        new URL('/onboarding?error=Invalid session state', request.url)
      )
    }

    // Create a simple success page that closes the popup and notifies parent
    const successPage = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Meta Connection Successful</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .container {
          background: linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%);
          padding: 40px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 400px;
        }
        .success-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #22c55e;
        }
        .message {
          color: #a0a9c0;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✅</div>
        <div class="title">Meta Business Connected!</div>
        <div class="message">
          Your Facebook Business Manager is now connected. 
          This window will close automatically.
        </div>
      </div>
      
      <script>
        // Exchange the code for access token
        fetch('/api/meta/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: '${sessionId}',
            code: '${code}',
            state: '${state}'
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Notify parent window if this is a popup
            if (window.opener) {
              window.opener.postMessage({
                type: 'META_AUTH_SUCCESS',
                data: data
              }, '*');
              window.close();
            } else {
              // If not a popup, redirect to onboarding
              window.location.href = '/onboarding?session_id=${sessionId}&meta_connected=true';
            }
          } else {
            console.error('Token exchange failed:', data.error);
            if (window.opener) {
              window.opener.postMessage({
                type: 'META_AUTH_ERROR',
                error: data.error
              }, '*');
              window.close();
            } else {
              window.location.href = '/onboarding?session_id=${sessionId}&error=' + encodeURIComponent(data.error);
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
          if (window.opener) {
            window.opener.postMessage({
              type: 'META_AUTH_ERROR',
              error: 'Failed to complete authentication'
            }, '*');
            window.close();
          } else {
            window.location.href = '/onboarding?session_id=${sessionId}&error=Failed to complete authentication';
          }
        });
      </script>
    </body>
    </html>
    `

    return new NextResponse(successPage, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Meta callback error:', error)
    return NextResponse.redirect(
      new URL('/onboarding?error=Authentication callback failed', request.url)
    )
  }
}