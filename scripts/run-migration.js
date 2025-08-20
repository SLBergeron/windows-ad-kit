const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function runMigration() {
  try {
    console.log('🚀 Running business_intel migration...')
    
    const migrationPath = path.join(__dirname, '../database/migrations/003_add_business_intel.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📄 Migration SQL:')
    console.log(sql)
    
    // Split the SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => {
        // Filter out empty statements and comment-only statements
        if (s.length === 0) return false
        // Remove comments and check if there's actual SQL content
        const withoutComments = s.split('\n')
          .filter(line => !line.trim().startsWith('--'))
          .join('\n')
          .trim()
        return withoutComments.length > 0
      })
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`⚙️ Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 100)}...`)
        // Since exec_sql doesn't exist, we need to use an alternative approach
        console.error('❌ Supabase exec_sql function not available')
        console.log('Please run this SQL manually in Supabase SQL Editor:')
        console.log('━'.repeat(60))
        console.log(sql)
        console.log('━'.repeat(60))
        return
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error)
          throw error
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      }
    }
    
    console.log('✅ business_intel migration completed successfully!')
    
    // Test the business_intel column exists
    console.log('🔍 Testing business_intel column...')
    const { data, error } = await supabase
      .from('campaigns')
      .select('business_intel')
      .limit(1)
    
    if (error) {
      console.error('❌ Error testing business_intel column:', error)
    } else {
      console.log('✅ business_intel column is accessible')
      console.log('📊 Test result:', data)
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()