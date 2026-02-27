from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

PROS = [
    {"nombre": "Ana", "zona": "Adrogue", "esp": "Interior", "modo": "Online", "precio": 3500,
     "desc": "Interior, riego y rescate. Plan de cuidado simple y claro."},
    {"nombre": "Luis", "zona": "Burzaco", "esp": "Plagas", "modo": "Online y Domicilio", "precio": 4500,
     "desc": "Control de plagas, diagnóstico por foto y plan preventivo."},
]

SOLICITUDES = []

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/api/profesionales")
def listar_profesionales():
    return jsonify({"ok": True, "items": PROS})

@app.post("/api/profesionales")
def crear_profesional():
    data = request.get_json(silent=True) or {}
    required = ["nombre", "zona", "esp", "modo", "precio", "desc"]
    if any(not str(data.get(k, "")).strip() for k in required):
        return jsonify({"ok": False, "error": "Faltan datos del profesional."}), 400

    pro = {
        "nombre": str(data["nombre"]).strip(),
        "zona": str(data["zona"]).strip(),
        "esp": str(data["esp"]).strip(),
        "modo": str(data["modo"]).strip(),
        "precio": int(data["precio"]),
        "desc": str(data["desc"]).strip(),
    }
    PROS.append(pro)
    return jsonify({"ok": True, "item": pro})

@app.post("/api/solicitudes")
def crear_solicitud():
    data = request.get_json(silent=True) or {}
    required = ["nombre", "tipo", "detalle"]
    if any(not str(data.get(k, "")).strip() for k in required):
        return jsonify({"ok": False, "error": "Faltan datos de la solicitud."}), 400

    sol = {
        "nombre": str(data["nombre"]).strip(),
        "zona": str(data.get("zona", "")).strip(),
        "tipo": str(data["tipo"]).strip(),
        "detalle": str(data["detalle"]).strip(),
        "urgente": bool(data.get("urgente", False)),
    }
    SOLICITUDES.append(sol)
    return jsonify({"ok": True, "item": sol})

if __name__ == "__main__":
    print("🚀 Salvabioverde iniciado en http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
    import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)