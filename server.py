from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS # Handles cross-origin requests automatically

app = Flask(__name__)
CORS(app) # Opens the gateway so your JS app can transmit data freely

# Secure memory database list to track incoming orders
kitchen_orders_queue = []

# Modern Kitchen Monitor UI Dashboard Template
KITCHEN_DASHBOARD_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>🧑‍🍳 LIVE KITCHEN MONITOR | Manu's Local Kitchen</title>
    <style>
        body { background-color: #0b0b0d; color: #f8fafc; font-family: system-ui, sans-serif; padding: 40px; }
        h1 { color: #e65c00; border-bottom: 2px solid #2d2d34; padding-bottom: 10px; margin-top: 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
        .order-ticket { background: #1a1a1e; border: 2px solid #e65c00; border-radius: 8px; padding: 20px; box-shadow: 0 4px 15px rgba(230, 92, 0, 0.15); }
        .customer-meta { color: #94a3b8; font-size: 0.95rem; margin-bottom: 15px; border-bottom: 1px solid #2d2d34; padding-bottom: 8px; line-height: 1.6; }
        ul { padding-left: 20px; color: #fff; }
        li { margin-bottom: 8px; font-weight: bold; font-size: 1.1rem; color: #e65c00; }
        .no-orders { text-align: center; color: #94a3b8; font-size: 1.2rem; margin-top: 50px; }
    </style>
</head>
<body>
    <h1>🧑‍🍳 Kitchen Preparation Monitor Queue</h1>
    <p>Incoming live dishes from customer app channels. Orders auto-refresh instantly.</p>
    
    {% if not orders %}
        <div class="no-orders">📭 No active orders in the preparation queue right now...</div>
    {% else %}
        <div class="grid">
            {% for order in orders %}
                <div class="order-ticket">
                    <h3>Ticket #{{ loop.index }} - {{ order.type }}</h3>
                    <div class="customer-meta">
                        <strong>Name:</strong> {{ order.name }}<br>
                        <strong>Phone:</strong> {{ order.phone }}
                    </div>
                    <h4>Dishes to Prepare:</h4>
                    <ul>
                        {% for item in order.items %}
                            <li>🍲 {{ item }}</li>
                        {% endfor %}
                    </ul>
                </div>
            {% endfor %}
        </div>
    {% endif %}
</body>
</html>
"""

@app.route('/kitchen')
def view_kitchen_screen():
    return render_template_string(KITCHEN_DASHBOARD_HTML, orders=kitchen_orders_queue)

@app.route('/api/submit-order', methods=['POST'])
def receive_new_order():
    data = request.get_json()
    
    new_ticket = {
        "name": data.get("name"),
        "phone": data.get("phone"),
        "type": data.get("type"),
        "items": data.get("items")
    }
    
    kitchen_orders_queue.append(new_ticket)
    print(f"📦 Backend Success: Received new order from customer client {new_ticket['name']}!")
    return jsonify({"status": "success", "message": "Order securely routed to the preparation queue!"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)