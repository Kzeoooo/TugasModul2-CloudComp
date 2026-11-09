<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Info Dashboard</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        h1 {
            text-align: center;
            color: #4a5568;
            margin-bottom: 5px;
        }
        .subtitle {
            text-align: center;
            color: #718096;
            margin-bottom: 30px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .card {
            background: #f7fafc;
            border-left: 5px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .card.full-width {
            grid-column: 1 / -1;
            border-left-color: #48bb78;
        }
        .card h3 {
            margin-top: 0;
            color: #2d3748;
            font-size: 1.1rem;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 0.95rem;
        }
        .label {
            font-weight: 600;
            color: #4a5568;
        }
        .value {
            color: #2b6cb0;
        }
        .feature-list {
            margin: 5px 0;
            padding-left: 20px;
            color: #2f855a;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 PHP Info Dashboard</h1>
        <div class="subtitle">PHP Version: <?php echo phpversion(); ?></div>
        
        <div class="grid">
            <!-- Server Info -->
            <div class="card">
                <h3>📊 Server Info</h3>
                <div class="info-item"><span class="label">OS:</span> <span class="value"><?php echo php_uname('s') . ' ' . php_uname('r'); ?></span></div>
                <div class="info-item"><span class="label">Server Software:</span> <span class="value"><?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Nginx'; ?></span></div>
                <div class="info-item"><span class="label">Protocol:</span> <span class="value"><?php echo $_SERVER['SERVER_PROTOCOL'] ?? 'HTTP/1.1'; ?></span></div>
            </div>

            <!-- PHP Configuration -->
            <div class="card">
                <h3>⚙️ PHP Configuration</h3>
                <div class="info-item"><span class="label">Memory Limit:</span> <span class="value"><?php echo ini_get('memory_limit'); ?></span></div>
                <div class="info-item"><span class="label">Max Execution:</span> <span class="value"><?php echo ini_get('max_execution_time'); ?>s</span></div>
                <div class="info-item"><span class="label">Post Max Size:</span> <span class="value"><?php echo ini_get('post_max_size'); ?></span></div>
            </div>

            <!-- System Info -->
            <div class="card">
                <h3>💻 System Info</h3>
                <div class="info-item"><span class="label">Architecture:</span> <span class="value"><?php echo php_uname('m'); ?></span></div>
                <div class="info-item"><span class="label">Current Time:</span> <span class="value"><?php echo date('Y-m-d H:i:s'); ?></span></div>
                <div class="info-item"><span class="label">Request Method:</span> <span class="value"><?php echo $_SERVER['REQUEST_METHOD']; ?></span></div>
            </div>

            <!-- PHP 8.4 Features -->
            <div class="card full-width">
                <h3>✨ PHP 8.4 Features</h3>
                <ul class="feature-list">
                    <li>Property Hooks</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>
