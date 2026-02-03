/**
 * Comprehensive code samples that showcase ALL tokens for each language
 * Each sample is designed to display every configured token type
 */

module.exports = {
  csharp: `// C# - Comprehensive Token Preview
/// <summary>
/// Documentation comment: Payment service with namespaces, enums, delegates
/// </summary>
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PaymentService.Core  // Namespace
{
    // Enum type
    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed
    }

    // Delegate type
    public delegate void PaymentEventHandler(object sender, PaymentEventArgs e);

    /// <summary>
    /// Block comment: Interface for payment processing
    /// </summary>
    public interface IPaymentProcessor  // Interface name
    {
        Task<decimal> CalculateCommission(decimal amount);
    }

    /* Multi-line block comment
       showing different comment styles */
    public class PaymentProcessor : IPaymentProcessor  // Class name
    {
        // Static field
        private static readonly decimal DefaultRate = 2.5m;

        // Instance field
        private decimal _commission;

        // Static method
        public static bool IsValidAmount(decimal amount)
        {
            return amount > 0;  // Keywords, operators, numbers
        }

        // Instance method with parameters
        public async Task<decimal> CalculateCommission(decimal amount)
        {
            // Local variables
            var baseAmount = amount;
            string currency = "USD";  // String literal
            int processingFee = 50;   // Number

            // Function call, operators, parentheses, braces, semicolons
            if (amount <= 0)
            {
                throw new ArgumentException("Invalid amount", nameof(amount));
            }

            // Dot accessor, commas, brackets
            var fees = new[] { 10, 20, 30 };

            // LINQ with method chains
            var topFees = fees
                .Where(f => f > 15)
                .OrderByDescending(f => f)
                .Select(f => $"Fee: {f}")
                .ToList();

            return baseAmount * DefaultRate / 100;
        }
    }
}`,
  sql: `-- SQL Server - Comprehensive Token Preview
/* Multi-line comment 
   for database schema */
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Parameter usage and keywords
DECLARE @MinId INT = 100;

SELECT u.Id, u.Username, 'Active' as Status
FROM Users u
JOIN Orders o ON u.Id = o.UserId
WHERE u.Id > @MinId
  AND u.Email LIKE '%@example.com'
ORDER BY u.CreatedAt DESC;`,

  typescript: `// TypeScript - Comprehensive Token Preview
/// Documentation comment for TypeScript

// Import/export (module keywords)
import { Observable } from 'rxjs';
export { UserService };

// Interface name
interface User {
  id: number;      // Property, number
  name: string;    // String type
  email?: string;  // Optional
}

// Type parameter (generic)
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<void>;
}

// Class with inheritance
class UserService implements Repository<User> {
  // Static field
  private static instance: UserService;

  // Instance field
  private cache: Map<number, User>;

  // Constructor with parameters
  constructor(private readonly apiUrl: string) {
    this.cache = new Map();  // this keyword
  }

  // Static method
  public static getInstance(): UserService {
    return this.instance;  // this keyword, dot accessor
  }

  // Async instance method with parameters
  async findById(id: number): Promise<User | null> {
    // Local variables
    const cacheKey = \`user-\${id}\`;  // String template
    let user = null;  // null keyword

    // Function calls, operators, parentheses
    if (this.cache.has(id)) {
      return this.cache.get(id) ?? null;
    }

    // try-catch, braces, semicolons
    try {
      const response = await fetch(\`\${this.apiUrl}/users/\${id}\`);
      user = await response.json();
      this.cache.set(id, user);  // Commas, brackets
    } catch (error) {
      console.error('Error:', error);  // String literal
    }

    return user;
  }

  async save(entity: User): Promise<void> {
    // undefined keyword
    if (entity === undefined) {
      throw new Error("Entity cannot be undefined");
    }
  }
}`,

  javascript: `// JavaScript - Comprehensive Token Preview
// Module keywords: import/export
import { EventEmitter } from 'events';
export default DashboardController;

/* Block comment
   Multi-line style */

// Class with various token types
class DashboardController extends EventEmitter {
  // Static field
  static API_BASE = 'https://api.example.com';

  // Instance fields
  #privateField = 42;  // Private field
  config = {};
  isLoading = false;

  // Constructor with parameters
  constructor(apiKey, options) {
    super();  // super keyword
    this.apiKey = apiKey;  // this keyword, dot accessor
    this.options = options;
  }

  // Static method
  static createDefault() {
    return new DashboardController('default-key', {});
  }

  // Instance method with async
  async loadData(userId) {
    // Local variables
    const url = \`\${DashboardController.API_BASE}/users/\${userId}\`;
    let response = null;  // null keyword
    var retryCount = 3;   // Numbers

    // Keywords: if, for, while, etc.
    if (this.isLoading) {
      return undefined;  // undefined keyword
    }

    this.isLoading = true;

    // try-catch-finally, operators, braces, parentheses
    try {
      // Function call, string literal
      response = await fetch(url, {
        method: 'GET',
        headers: { 'X-API-Key': this.apiKey }
      });

      // Operators: ==, !=, &&, ||, !, etc.
      if (!response.ok && response.status !== 404) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      // Arrays, brackets, commas
      const data = await response.json();
      const items = [1, 2, 3, 4, 5];

      // RegExp literal
      const emailPattern = /^[\\w.-]+@[\\w.-]+\\.\\w+$/;

      // Semicolons, dots, various operators
      for (let i = 0; i < items.length; i++) {
        console.log(items[i]);
      }

      return data;
    } catch (error) {
      console.error('Failed to load:', error);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  // Arrow function, this keyword
  updateUI = (data) => {
    this.emit('update', data);
  }
}`,

  html: `<!-- HTML - Comprehensive Token Preview -->
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Attribute names: charset, name, content -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Dashboard application">

  <!-- Tag names: title, link, script -->
  <title>Merchant Dashboard</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" type="image/png" href="favicon.png">
</head>
<body>
  <!-- Tag name: div, attributes: class, id, data-* -->
  <div class="dashboard-container" id="main-dashboard" data-theme="ocean-harbor">

    <!-- Tag name: header, nav -->
    <header class="app-header">
      <h1 class="title">Analytics Dashboard</h1>

      <!-- Attribute: aria-label for accessibility -->
      <nav aria-label="Main navigation" role="navigation">
        <a href="#overview" class="nav-link active">Overview</a>
        <a href="#reports" class="nav-link">Reports</a>
        <a href="#settings" class="nav-link" data-section="settings">Settings</a>
      </nav>
    </header>

    <!-- Tag name: main, section, article -->
    <main class="content-area">
      <section id="stats" class="stats-grid">
        <article class="stat-card primary">
          <h2 class="stat-title">Total Revenue</h2>
          <p class="stat-value" id="revenue">$127,450.00</p>
          <span class="stat-change positive">+12%</span>
        </article>

        <article class="stat-card">
          <h2 class="stat-title">Active Users</h2>
          <p class="stat-value">45,821</p>
        </article>
      </section>

      <!-- Form elements: input, button, select, textarea -->
      <form action="/api/settings" method="post" class="settings-form">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter username" required>

        <label for="role">Role:</label>
        <select id="role" name="role">
          <option value="admin">Administrator</option>
          <option value="user" selected>User</option>
        </select>

        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>
    </main>

    <!-- Footer with multiple attributes -->
    <footer class="app-footer" role="contentinfo">
      <p>&copy; 2026 Dashboard App. All rights reserved.</p>
    </footer>
  </div>

  <!-- Script tag with src and type attributes -->
  <script src="dashboard.js" type="module"></script>
  <script async defer src="analytics.js"></script>
</body>
</html>`,

  css: `/* CSS - Comprehensive Token Preview */

/* Tag selector */
body {
  margin: 0;
  padding: 0;
}

/* Class selector */
.dashboard {
  /* Property names and values */
  background: linear-gradient(135deg, #009688, #00695c);
  padding: 2rem;
  margin: 1em auto;
  max-width: 1200px;

  /* Property with function */
  transform: translateY(0) scale(1.0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* ID selector */
#main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: var(--primary-color);
}

/* Pseudo-class */
.nav-link:hover {
  color: #009688;
  text-decoration: underline;
}

/* Pseudo-element */
.stat-card::before {
  content: "📊";
  font-size: 2em;
  position: absolute;
  top: 10px;
  left: 10px;
}

/* Multiple selectors, descendant combinator */
.stats-grid > .stat-card {
  background: #263238;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

/* Attribute selector */
[data-theme="ocean-harbor"] {
  --primary-color: #009688;
  --secondary-color: #00695c;
  --text-color: #b8c5d0;
}

/* Class with multiple pseudo-classes */
.btn:hover:not(:disabled) {
  background-color: #007d71;
  cursor: pointer;
}

/* Functions: calc(), rgb(), var() */
.container {
  width: calc(100% - 40px);
  color: rgb(184, 197, 208);
  background: var(--primary-color);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Media query */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
    font-size: 14px;
  }
}

/* Keyframes animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pseudo-class :nth-child */
.stat-card:nth-child(even) {
  background-color: #2e3c43;
}`,

  json: `{
  "name": "merchant-dashboard",
  "version": "2.1.0",
  "description": "Analytics dashboard for merchants",
  "private": true,
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon --watch src server.js",
    "test": "jest --coverage --verbose",
    "build": "webpack --mode production",
    "lint": "eslint src/**/*.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "mongoose": "^7.5.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.1",
    "webpack": "^5.88.2",
    "eslint": "^8.52.0"
  },
  "keywords": [
    "analytics",
    "dashboard",
    "merchant",
    "revenue"
  ],
  "author": {
    "name": "Your Name",
    "email": "email@example.com"
  },
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "config": {
    "port": 3000,
    "apiUrl": "https://api.example.com",
    "debug": true,
    "maxRetries": 3,
    "timeout": 5000
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  }
}`,

  yaml: `# YAML - Comprehensive Token Preview
---
# Server Configuration
server:
  port: 3000
  host: localhost
  protocol: https
  ssl:
    enabled: true
    certPath: /path/to/cert.pem
    keyPath: /path/to/key.pem

# Database Configuration
database:
  driver: postgresql
  host: db.example.com
  port: 5432
  name: merchant_db
  credentials:
    user: admin
    password: secure_password_123
  pool:
    min: 2
    max: 10
    idleTimeout: 30000
  options:
    ssl: true
    logging: false

# Application Settings
app:
  name: Merchant Dashboard
  version: 2.1.0
  environment: production
  debug: false

# Logging Configuration
logging:
  level: info
  format: json
  outputs:
    - type: file
      path: /var/log/app.log
      maxSize: 100MB
      maxFiles: 10
    - type: console
      colorize: true

# Feature Flags
features:
  analytics: true
  notifications: false
  realtime: true
  caching:
    enabled: true
    ttl: 3600
    provider: redis
    redis:
      host: redis.example.com
      port: 6379
      db: 0

# API Configuration
api:
  baseUrl: https://api.example.com
  timeout: 5000
  retries: 3
  endpoints:
    users: /api/v1/users
    payments: /api/v1/payments
    analytics: /api/v1/analytics
  headers:
    Content-Type: application/json
    Accept: application/json

# Security Settings
security:
  jwt:
    secret: your-secret-key
    expiresIn: 24h
    algorithm: HS256
  cors:
    enabled: true
    origins:
      - https://example.com
      - https://app.example.com
    methods:
      - GET
      - POST
      - PUT
      - DELETE`,

  markdown: `# Markdown - Comprehensive Token Preview

This is a **comprehensive** example showing *all* Markdown token types.

## Headers (Level 2)

### Level 3 Header

#### Level 4 Header

##### Level 5 Header

###### Level 6 Header

## Text Formatting

**Bold text** using double asterisks
__Bold text__ using double underscores

*Italic text* using single asterisks
_Italic text_ using single underscores

***Bold and italic*** combined
~~Strikethrough text~~

## Links and Images

[Text link to documentation](https://docs.example.com)
[Link with title](https://example.com "Example Site")

Auto-link: <https://example.com>
Email: <support@example.com>

![Alt text for image](image.png)
![Image with title](image.png "Image Title")

## Code

Inline \`code\` with backticks

\`\`\`javascript
// Code block with syntax highlighting
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

## Lists

### Bullet List

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

* Alternative bullet
+ Another alternative

### Numbered List

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

## Blockquotes

> This is a blockquote
> It can span multiple lines
>
> And have multiple paragraphs

> **Note:** Blockquotes can contain other elements

## Tables

| Metric | Value | Change |
|--------|-------|--------|
| Revenue | $127K | +12% |
| Users | 45K | +8% |
| Conversion | 3.2% | +0.4% |

## Horizontal Rule

---

## Task List

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## References

Reference-style links: [Link text][1]

[1]: https://example.com "Reference Link"

![Reference image][logo]

[logo]: logo.png "Company Logo"`,

  bash: `#!/bin/bash
# Bash - Comprehensive Token Preview
# Deployment script showing various shell commands

set -e  # Exit on error
set -u  # Exit on undefined variable

# Variables
APP_NAME="merchant-dashboard"
DEPLOY_ENV="\${1:-production}"
VERSION=\$(git describe --tags --always)
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/\${APP_NAME}"

# Colors for output
readonly GREEN='\\033[0;32m'
readonly YELLOW='\\033[1;33m'
readonly RED='\\033[0;31m'
readonly NC='\\033[0m'

# Functions
log_info() {
    echo -e "\${GREEN}[INFO]\${NC} \$*"
}

log_warn() {
    echo -e "\${YELLOW}[WARN]\${NC} \$*"
}

log_error() {
    echo -e "\${RED}[ERROR]\${NC} \$*"
}

# Main deployment
log_info "Starting deployment of \${APP_NAME} v\${VERSION}"

# Check environment
if [ "\${DEPLOY_ENV}" != "production" ] && [ "\${DEPLOY_ENV}" != "staging" ]; then
    log_error "Invalid environment. Use 'production' or 'staging'"
    exit 1
fi

# Create backup directory
mkdir -p "\${BACKUP_DIR}"

# Backup current version
if [ -d "/var/www/\${APP_NAME}" ]; then
    log_info "Creating backup..."
    tar -czf "\${BACKUP_DIR}/backup_\${TIMESTAMP}.tar.gz" \\
        -C /var/www "\${APP_NAME}"
fi

# Install dependencies
log_info "Installing dependencies..."
npm ci --production

# Build application
log_info "Building application..."
npm run build

# Run tests
log_info "Running tests..."
npm test || {
    log_error "Tests failed"
    exit 1
}

# Deploy files
log_info "Deploying to \${DEPLOY_ENV}..."
rsync -avz --delete \\
    --exclude 'node_modules' \\
    --exclude '.git' \\
    dist/ "deploy@server:/var/www/\${APP_NAME}/"

# Restart service
log_info "Restarting service..."
ssh deploy@server << EOF
    sudo systemctl restart \${APP_NAME}
    sudo systemctl status \${APP_NAME}
EOF

# Health check
log_info "Running health check..."
for i in {1..5}; do
    if curl -sf "http://localhost:3000/health" > /dev/null; then
        log_info "Health check passed"
        break
    fi
    log_warn "Health check attempt \$i failed, retrying..."
    sleep 2
done

# Cleanup old backups (keep last 5)
log_info "Cleaning up old backups..."
ls -t "\${BACKUP_DIR}"/*.tar.gz | tail -n +6 | xargs -r rm

log_info "Deployment complete!"
log_info "Version: \${VERSION}"
log_info "Environment: \${DEPLOY_ENV}"
log_info "Timestamp: \${TIMESTAMP}"`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<!-- XML - Comprehensive Token Preview -->
<!-- Application configuration file -->

<!DOCTYPE configuration SYSTEM "config.dtd">

<configuration xmlns="http://example.com/config"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="http://example.com/config config.xsd">

  <!-- Application Settings -->
  <appSettings>
    <add key="AppName" value="Merchant Dashboard" />
    <add key="Version" value="2.1.0" />
    <add key="Environment" value="production" />
    <add key="Debug" value="false" />
    <add key="LogLevel" value="info" />
  </appSettings>

  <!-- Connection Strings -->
  <connectionStrings>
    <add name="MainDB"
         connectionString="Server=localhost;Database=merchants;User Id=admin;Password=***;"
         providerName="System.Data.SqlClient" />
    <add name="CacheDB"
         connectionString="Server=redis;Port=6379;Database=0;"
         providerName="Redis.Client" />
  </connectionStrings>

  <!-- System Configuration -->
  <system.web>
    <compilation debug="false" targetFramework="4.8" />
    <httpRuntime targetFramework="4.8"
                 maxRequestLength="10240"
                 executionTimeout="120"
                 enableVersionHeader="false" />
    <customErrors mode="RemoteOnly"
                  defaultRedirect="~/Error"
                  redirectMode="ResponseRewrite">
      <error statusCode="404" redirect="~/NotFound" />
      <error statusCode="500" redirect="~/ServerError" />
    </customErrors>
    <authentication mode="Forms">
      <forms loginUrl="~/Account/Login"
             timeout="2880"
             slidingExpiration="true" />
    </authentication>
  </system.web>

  <!-- Modules -->
  <modules>
    <module name="AnalyticsModule"
            type="Dashboard.Analytics.Module"
            enabled="true" />
    <module name="LoggingModule"
            type="Dashboard.Logging.Module"
            enabled="true">
      <settings>
        <add key="LogPath" value="/var/log/app" />
        <add key="MaxFileSize" value="100MB" />
      </settings>
    </module>
    <module name="CachingModule"
            type="Dashboard.Cache.Module"
            enabled="false" />
  </modules>

  <!-- API Endpoints -->
  <api baseUrl="https://api.example.com" timeout="5000">
    <endpoints>
      <endpoint name="users" path="/api/v1/users" method="GET" />
      <endpoint name="payments" path="/api/v1/payments" method="POST" />
      <endpoint name="analytics" path="/api/v1/analytics" method="GET">
        <headers>
          <add name="Authorization" value="Bearer {token}" />
          <add name="Content-Type" value="application/json" />
        </headers>
      </endpoint>
    </endpoints>
  </api>

  <!-- Feature Flags -->
  <features>
    <feature name="RealTimeUpdates" enabled="true" />
    <feature name="AdvancedAnalytics" enabled="false" />
    <feature name="Notifications" enabled="true">
      <settings>
        <add key="Provider" value="Email" />
        <add key="SmtpServer" value="smtp.example.com" />
      </settings>
    </feature>
  </features>

</configuration>`
};
