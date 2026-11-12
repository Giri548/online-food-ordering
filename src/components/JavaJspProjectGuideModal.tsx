import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileText, Database, Server, BookOpen, Layers, Terminal } from 'lucide-react';

interface JavaJspProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JavaJspProjectGuideModal: React.FC<JavaJspProjectGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'jsp' | 'servlets' | 'dao' | 'mysql' | 'webxml' | 'guide'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeSnippets = {
    indexJsp: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.foodie.model.FoodItem, com.foodie.dao.FoodDAO" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Foodie - Online Food Ordering</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Navigation Bar -->
    <header class="navbar">
        <div class="logo">Foodie<span>.</span></div>
        <nav>
            <a href="index.jsp">Home</a>
            <a href="#menu">Menu</a>
            <a href="cart.jsp" class="cart-btn">
                Cart (<%= session.getAttribute("cartCount") != null ? session.getAttribute("cartCount") : 0 %>)
            </a>
        </nav>
    </header>

    <!-- Hero Banner -->
    <section class="hero">
        <h1>Delicious Food Delivered To Your Doorstep</h1>
        <p>Order fresh Pizza, Burger, Biriyani, Sandwich & French Fries anytime!</p>
        <a href="#menu" class="btn-primary">Explore Menu</a>
    </section>

    <!-- Food Menu Section -->
    <section id="menu" class="container">
        <h2 class="section-title">Our Tasty Menu</h2>
        <div class="food-grid">
            <%
                FoodDAO dao = new FoodDAO();
                List<FoodItem> foodList = dao.getAllFoodItems();
                for (FoodItem item : foodList) {
            %>
            <div class="food-card">
                <img src="<%= item.getImage() %>" alt="<%= item.getName() %>">
                <div class="card-body">
                    <h3><%= item.getName() %></h3>
                    <p><%= item.getDescription() %></p>
                    <div class="price-action">
                        <span class="price">₹<%= String.format("%.2f", item.getPrice()) %></span>
                        <form action="CartServlet" method="POST">
                            <input type="hidden" name="action" value="add">
                            <input type="hidden" name="itemId" value="<%= item.getId() %>">
                            <button type="submit" class="btn-add">Add to Cart</button>
                        </form>
                    </div>
                </div>
            </div>
            <%
                }
            %>
        </div>
    </section>
</body>
</html>`,

    cartJsp: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Map, com.foodie.model.CartItem" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your Foodie Cart</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="navbar">
        <div class="logo"><a href="index.jsp">Foodie<span>.</span></a></div>
        <nav><a href="index.jsp">← Back to Menu</a></nav>
    </header>

    <div class="container cart-page">
        <h2>Your Shopping Cart</h2>
        <%
            Map<Integer, CartItem> cart = (Map<Integer, CartItem>) session.getAttribute("cart");
            double total = 0.0;
            if (cart == null || cart.isEmpty()) {
        %>
            <p>Your cart is empty. <a href="index.jsp">Order delicious food now!</a></p>
        <%
            } else {
        %>
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Food Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                <%
                    for (CartItem ci : cart.values()) {
                        double sub = ci.getItem().getPrice() * ci.getQuantity();
                        total += sub;
                %>
                    <tr>
                        <td><strong><%= ci.getItem().getName() %></strong></td>
                        <td>₹<%= String.format("%.2f", ci.getItem().getPrice()) %></td>
                        <td>
                            <form action="CartServlet" method="POST" style="display:inline;">
                                <input type="hidden" name="action" value="update">
                                <input type="hidden" name="itemId" value="<%= ci.getItem().getId() %>">
                                <input type="hidden" name="qty" value="<%= ci.getQuantity() - 1 %>">
                                <button type="submit">-</button>
                            </form>
                            <span><%= ci.getQuantity() %></span>
                            <form action="CartServlet" method="POST" style="display:inline;">
                                <input type="hidden" name="action" value="update">
                                <input type="hidden" name="itemId" value="<%= ci.getItem().getId() %>">
                                <input type="hidden" name="qty" value="<%= ci.getQuantity() + 1 %>">
                                <button type="submit">+</button>
                            </form>
                        </td>
                        <td>₹<%= String.format("%.2f", sub) %></td>
                        <td>
                            <form action="CartServlet" method="POST">
                                <input type="hidden" name="action" value="remove">
                                <input type="hidden" name="itemId" value="<%= ci.getItem().getId() %>">
                                <button type="submit" class="btn-remove">Remove</button>
                            </form>
                        </td>
                    </tr>
                <%
                    }
                %>
                </tbody>
            </table>

            <div class="cart-summary">
                <h3>Total Price: ₹<%= String.format("%.2f", total) %></h3>
                <form action="OrderServlet" method="POST">
                    <input type="hidden" name="total" value="<%= total %>">
                    <input type="text" name="customerName" placeholder="Your Full Name" required>
                    <input type="text" name="customerPhone" placeholder="Mobile Number" required>
                    <textarea name="customerAddress" placeholder="Delivery Address" required></textarea>
                    <button type="submit" class="btn-primary">Place Order</button>
                </form>
            </div>
        <%
            }
        %>
    </div>
</body>
</html>`,

    cartServlet: `package com.foodie.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.foodie.dao.FoodDAO;
import com.foodie.model.CartItem;
import com.foodie.model.FoodItem;

@WebServlet("/CartServlet")
public class CartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        int itemId = Integer.parseInt(request.getParameter("itemId"));

        HttpSession session = request.getSession();
        @SuppressWarnings("unchecked")
        Map<Integer, CartItem> cart = (Map<Integer, CartItem>) session.getAttribute("cart");
        if (cart == null) {
            cart = new HashMap<>();
        }

        FoodDAO dao = new FoodDAO();

        if ("add".equalsIgnoreCase(action)) {
            if (cart.containsKey(itemId)) {
                CartItem ci = cart.get(itemId);
                ci.setQuantity(ci.getQuantity() + 1);
            } else {
                FoodItem item = dao.getFoodById(itemId);
                if (item != null) {
                    cart.put(itemId, new CartItem(item, 1));
                }
            }
        } else if ("update".equalsIgnoreCase(action)) {
            int qty = Integer.parseInt(request.getParameter("qty"));
            if (qty <= 0) {
                cart.remove(itemId);
            } else if (cart.containsKey(itemId)) {
                cart.get(itemId).setQuantity(qty);
            }
        } else if ("remove".equalsIgnoreCase(action)) {
            cart.remove(itemId);
        }

        // Calculate total count
        int cartCount = 0;
        for (CartItem ci : cart.values()) {
            cartCount += ci.getQuantity();
        }

        session.setAttribute("cart", cart);
        session.setAttribute("cartCount", cartCount);

        if ("add".equalsIgnoreCase(action)) {
            response.sendRedirect("index.jsp#menu");
        } else {
            response.sendRedirect("cart.jsp");
        }
    }
}`,

    foodDAO: `package com.foodie.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import com.foodie.model.FoodItem;

public class FoodDAO {

    public List<FoodItem> getAllFoodItems() {
        List<FoodItem> list = new ArrayList<>();
        String query = "SELECT id, name, category, price, description, image FROM food_items";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new FoodItem(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("category"),
                    rs.getDouble("price"),
                    rs.getString("description"),
                    rs.getString("image")
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public FoodItem getFoodById(int id) {
        String query = "SELECT id, name, category, price, description, image FROM food_items WHERE id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new FoodItem(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("category"),
                        rs.getDouble("price"),
                        rs.getString("description"),
                        rs.getString("image")
                    );
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}`,

    dbConnection: `package com.foodie.dao;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/foodie_db?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASS = "root"; // your mysql password

    public static Connection getConnection() {
        Connection con = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(URL, USER, PASS);
        } catch (Exception e) {
            System.err.println("Database Connection Failed: " + e.getMessage());
            e.printStackTrace();
        }
        return con;
    }
}`,

    mysqlSchema: `-- Create Foodie Database
CREATE DATABASE IF NOT EXISTS foodie_db;
USE foodie_db;

-- 1. Table for Food Items
CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image VARCHAR(255)
);

-- Seed Initial Required Food Items
INSERT INTO food_items (name, category, price, description, image) VALUES
('Margherita Pizza', 'Pizza', 199.00, 'Classic Italian pizza with tomato sauce, fresh buffalo mozzarella and basil', 'images/pizza.jpg'),
('Gourmet Smash Burger', 'Burger', 99.00, 'Double beef patty, melted cheddar cheese, caramelized onions and secret sauce', 'images/burger.jpg'),
('Royal Hyderabadi Dum Biryani', 'Biriyani', 149.00, 'Fragrant basmati rice layered with spiced tender chicken and saffron', 'images/biryani.jpg'),
('Artisan Club Sandwich', 'Sandwich', 79.00, 'Toasted sourdough with grilled chicken, provolone cheese, avocado and tomato', 'images/sandwich.jpg'),
('Crispy French Fries', 'French Fries', 89.00, 'Golden crispy salted potatoes with garlic herb seasoning', 'images/fries.jpg');

-- 2. Table for Orders
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Confirmed',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table for Order Items
CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    food_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food_items(id)
);`,

    webXml: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                             http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">

    <display-name>Foodie Web Application</display-name>

    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <servlet>
        <servlet-name>CartServlet</servlet-name>
        <servlet-class>com.foodie.servlet.CartServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>CartServlet</servlet-name>
        <url-pattern>/CartServlet</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>OrderServlet</servlet-name>
        <servlet-class>com.foodie.servlet.OrderServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>OrderServlet</servlet-name>
        <url-pattern>/OrderServlet</url-pattern>
    </servlet-mapping>

    <session-config>
        <session-timeout>30</session-timeout>
    </session-config>
</web-app>`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Java (JSP / Servlet) & MySQL Source Code Guide
              </h2>
              <p className="text-xs text-stone-400">
                Complete, beginner-friendly architecture & runnable source files for "Foodie"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-stone-100 border-b border-stone-200 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Project Structure
          </button>
          <button
            onClick={() => setActiveTab('jsp')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'jsp' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            index.jsp & cart.jsp
          </button>
          <button
            onClick={() => setActiveTab('servlets')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'servlets' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            CartServlet.java
          </button>
          <button
            onClick={() => setActiveTab('dao')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dao' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            FoodDAO & DBConnection
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'mysql' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            MySQL schema.sql
          </button>
          <button
            onClick={() => setActiveTab('webxml')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'webxml' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            web.xml
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'guide' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            How to Run (Tomcat)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50 text-stone-800 text-xs">
          
          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-600" />
                  Foodie Standard Dynamic Web Project Directory Structure
                </h3>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
{`FoodieApp/
├── src/
│   └── com/
│       └── foodie/
│           ├── model/
│           │   ├── FoodItem.java        // POJO for food products (id, name, price, etc.)
│           │   └── CartItem.java        // Cart wrapper (item + quantity)
│           ├── dao/
│           │   ├── DBConnection.java    // JDBC Driver & Connection pool
│           │   └── FoodDAO.java         // SQL queries to fetch Pizza, Burger, Biriyani, etc.
│           └── servlet/
│               ├── CartServlet.java     // Adds, updates, removes items in HTTP session
│               └── OrderServlet.java    // Processes checkout & saves order to MySQL
├── WebContent/  (or src/main/webapp in Maven)
│   ├── index.jsp                        // Home page with food items, prices & Add to Cart
│   ├── cart.jsp                         // Cart page calculating subtotals & grand total
│   ├── orderConfirmation.jsp           // Displays placed order ID & confirmation
│   ├── css/
│   │   └── style.css                    // Custom warm food-themed styling
│   ├── images/
│   │   ├── pizza.jpg
│   │   ├── burger.jpg
│   │   ├── biryani.jpg
│   │   ├── sandwich.jpg
│   │   └── fries.jpg
│   └── WEB-INF/
│       ├── web.xml                      // Servlet mappings and deployment configuration
│       └── lib/
│           ├── mysql-connector-j-8.x.jar // MySQL JDBC Driver
│           └── jstl-1.2.jar             // Optional JSP Standard Tag Library
└── database.sql                         // MySQL database schema & sample inserts`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1">1. MVC Pattern</div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    <strong>Model:</strong> FoodItem & CartItem<br/>
                    <strong>View:</strong> index.jsp & cart.jsp<br/>
                    <strong>Controller:</strong> CartServlet & OrderServlet
                  </p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1">2. Session Cart</div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Uses <code className="text-orange-600 font-mono">session.getAttribute("cart")</code> to store a map of items so user carts persist across requests without needing complex cookies.
                  </p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1">3. Beginner Friendly</div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Pure JSP and Standard Servlets with zero bulky frameworks. Works on any Apache Tomcat 9/10 server.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* JSP Code Tab */}
          {activeTab === 'jsp' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-mono">index.jsp (Home & Menu Page)</span>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.indexJsp, 'indexJsp')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 cursor-pointer font-medium"
                  >
                    {copiedKey === 'indexJsp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'indexJsp' ? 'Copied!' : 'Copy index.jsp'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-72">
                  {codeSnippets.indexJsp}
                </pre>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-mono">cart.jsp (Cart & Total Calculation)</span>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.cartJsp, 'cartJsp')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 cursor-pointer font-medium"
                  >
                    {copiedKey === 'cartJsp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cartJsp' ? 'Copied!' : 'Copy cart.jsp'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-72">
                  {codeSnippets.cartJsp}
                </pre>
              </div>
            </div>
          )}

          {/* Servlets Code Tab */}
          {activeTab === 'servlets' && (
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 font-mono">CartServlet.java</span>
                <button
                  onClick={() => copyToClipboard(codeSnippets.cartServlet, 'cartServlet')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 cursor-pointer font-medium"
                >
                  {copiedKey === 'cartServlet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'cartServlet' ? 'Copied!' : 'Copy CartServlet.java'}</span>
                </button>
              </div>
              <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-96">
                {codeSnippets.cartServlet}
              </pre>
            </div>
          )}

          {/* DAO Tab */}
          {activeTab === 'dao' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-mono">FoodDAO.java</span>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.foodDAO, 'foodDAO')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 cursor-pointer font-medium"
                  >
                    {copiedKey === 'foodDAO' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'foodDAO' ? 'Copied!' : 'Copy FoodDAO.java'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-64">
                  {codeSnippets.foodDAO}
                </pre>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-mono">DBConnection.java (JDBC Connection)</span>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.dbConnection, 'dbConn')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 cursor-pointer font-medium"
                  >
                    {copiedKey === 'dbConn' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'dbConn' ? 'Copied!' : 'Copy DBConnection.java'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-48">
                  {codeSnippets.dbConnection}
                </pre>
              </div>
            </div>
          )}

          {/* MySQL Tab */}
          {activeTab === 'mysql' && (
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 font-mono">database.sql (MySQL Schema & Data)</span>
                <button
                  onClick={() => copyToClipboard(codeSnippets.mysqlSchema, 'mysql')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 cursor-pointer font-medium"
                >
                  {copiedKey === 'mysql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'mysql' ? 'Copied!' : 'Copy database.sql'}</span>
                </button>
              </div>
              <pre className="p-3 bg-stone-900 text-emerald-300 rounded-lg font-mono text-[11px] overflow-x-auto max-h-96">
                {codeSnippets.mysqlSchema}
              </pre>
            </div>
          )}

          {/* web.xml Tab */}
          {activeTab === 'webxml' && (
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 font-mono">WebContent/WEB-INF/web.xml</span>
                <button
                  onClick={() => copyToClipboard(codeSnippets.webXml, 'webXml')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 cursor-pointer font-medium"
                >
                  {copiedKey === 'webXml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'webXml' ? 'Copied!' : 'Copy web.xml'}</span>
                </button>
              </div>
              <pre className="p-3 bg-stone-900 text-amber-200 rounded-lg font-mono text-[11px] overflow-x-auto max-h-80">
                {codeSnippets.webXml}
              </pre>
            </div>
          )}

          {/* How to Run Tab */}
          {activeTab === 'guide' && (
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-600" />
                Step-by-Step Instructions to Run the Foodie Java Project
              </h3>

              <ol className="list-decimal list-inside space-y-3 text-stone-700 text-xs leading-relaxed">
                <li>
                  <strong>Install Prerequisites:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 text-stone-600 space-y-1">
                    <li>Java Development Kit (JDK 8, 11, 17, or 21)</li>
                    <li>Apache Tomcat Server (v9.0 or v10.0)</li>
                    <li>MySQL Server (v8.0) & MySQL Workbench</li>
                    <li>IDE: Eclipse IDE for Enterprise Java or IntelliJ IDEA Ultimate</li>
                  </ul>
                </li>
                <li>
                  <strong>Setup MySQL Database:</strong>
                  <div className="ml-4 mt-1">
                    Open MySQL Workbench or terminal and execute the queries from the <code>database.sql</code> tab. Verify that <code>food_items</code> table is created and seeded.
                  </div>
                </li>
                <li>
                  <strong>Import / Create Dynamic Web Project:</strong>
                  <div className="ml-4 mt-1">
                    In Eclipse: <code>File → New → Dynamic Web Project</code>. Name it <code>FoodieApp</code>. Target runtime: <code>Apache Tomcat</code>.
                  </div>
                </li>
                <li>
                  <strong>Add MySQL Driver JAR:</strong>
                  <div className="ml-4 mt-1">
                    Download <code>mysql-connector-j.jar</code> and paste it into <code>WebContent/WEB-INF/lib/</code>.
                  </div>
                </li>
                <li>
                  <strong>Copy Java Classes & JSP Files:</strong>
                  <div className="ml-4 mt-1">
                    Copy <code>DBConnection.java</code>, <code>FoodDAO.java</code>, <code>CartServlet.java</code> into <code>src/</code> and <code>index.jsp</code>, <code>cart.jsp</code> into <code>WebContent/</code>.
                  </div>
                </li>
                <li>
                  <strong>Run on Server:</strong>
                  <div className="ml-4 mt-1">
                    Right click on <code>FoodieApp → Run As → Run on Server</code>. Open your browser and navigate to:
                    <div className="mt-1 p-2 bg-stone-100 rounded font-mono font-bold text-orange-600">
                      http://localhost:8080/FoodieApp/index.jsp
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Enjoying the live interactive food ordering website? You can test the full ordering flow right here in the web app!
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Back to Foodie App
          </button>
        </div>

      </div>
    </div>
  );
};
