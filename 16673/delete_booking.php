/* General Styles */
body {
font-family: Arial, sans-serif;
background-color: #f8f9fa;
padding: 20px;
}

/* Centered Container */
.container {
width: 80%;
margin: auto;
background: white;
padding: 20px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
border-radius: 8px;
}

/* Heading */
h2 {
text-align: center;
color: #007bff;
margin-bottom: 20px;
}

/* Table Styling */
table {
width: 100%;
border-collapse: collapse;
margin-top: 10px;
background: white;
}

th, td {
border: 1px solid #ddd;
padding: 12px;
text-align: center;
}

th {
background-color: #007bff;
color: white;
text-transform: uppercase;
}

tr:nth-child(even) {
background-color: #f2f2f2;
}

tr:hover {
background-color: #e9ecef;
}

/* Buttons */
.btn {
padding: 8px 12px;
font-size: 14px;
text-decoration: none;
border-radius: 5px;
display: inline-block;
transition: 0.3s;
}

.btn-delete {
background-color: #dc3545;
color: white;
border: none;
}

.btn-delete:hover {
background-color: #c82333;
}

/* Responsive Design */
@media (max-width: 768px) {
.container {
width: 95%;
}

table {
font-size: 14px;
}

.btn {
padding: 6px 10px;
font-size: 12px;
}
}