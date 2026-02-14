* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background: #f4f8fc;
  color: #333;
}

header {
  background: linear-gradient(135deg, #001f3f, #00aaff);
  color: white;
  padding-bottom: 40px;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.hero {
  text-align: center;
  padding: 40px 20px;
}

.btn {
  display: inline-block;
  background: #0077cc;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  color: white;
  text-decoration: none;
}

section {
  padding: 60px 20px;
  text-align: center;
}

section:nth-child(even) {
  background: #eaf4ff;
}

ul {
  list-style: none;
}

.slider {
  position: relative;
  max-width: 400px;
  margin: 20px auto;
}

.slide {
  width: 100%;
  display: none;
  border-radius: 10px;
}

.prev, .next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}

.prev { left: -40px; }
.next { right: -40px; }

footer {
  background: #111;
  color: white;
  padding: 20px;
}

.menu-icon {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.menu-icon span {
  height: 4px;
  width: 25px;
  background: white;
  margin: 4px 0;
}

@media (max-width: 768px) {
  nav ul {
    display: none;
    flex-direction: column;
    background: #002b55;
    position: absolute;
    top: 70px;
    right: 20px;
    padding: 15px;
  }

  nav.active ul {
    display: flex;
  }

  .menu-icon {
    display: flex;
  }
}

