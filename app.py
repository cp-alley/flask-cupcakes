"""Flask app for Cupcakes"""


import os

from flask import Flask, jsonify, request, render_template
from flask_debugtoolbar import DebugToolbarExtension

from models import connect_db, db, Cupcake

app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DATABASE_URL", "postgresql:///cupcakes")

connect_db(app)

# Having the Debug Toolbar show redirects explicitly is often useful;
# however, if you want to turn it off, you can uncomment this line:
#
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)


@app.get("/")
def show_homepage():
    """Display the homepage."""
    return render_template("home.html")


@app.get('/api/cupcakes')
def show_all_cupcakes():
    """Get all cupcakes and return JSON."""
    cupcakes = Cupcake.query.all()
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes=serialized)


@app.get('/api/cupcakes/<int:cupcake_id>')
def show_cupcake(cupcake_id):
    """Get specific cupcake and return JSON."""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)


@app.post('/api/cupcakes')
def create_cupcake():
    """Create a new cupcake and return JSON."""
    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image_url = request.json.get("image_url") or None

    new_cupcake = Cupcake(flavor=flavor, size=size,
                          rating=rating, image_url=image_url)

    db.session.add(new_cupcake)
    db.session.commit()

    serialized = new_cupcake.serialize()

    return (jsonify(cupcake=serialized), 201)


@app.patch('/api/cupcakes/<int:cupcake_id>')
def update_cupcake(cupcake_id):
    """Update a cupcake and return JSON."""
    cupcake = Cupcake.query.get_or_404(cupcake_id)

    cupcake.flavor = request.json.get("flavor", cupcake.flavor)
    cupcake.size = request.json.get("size", cupcake.size)
    cupcake.rating = request.json.get("rating", cupcake.rating)
    cupcake.image_url = request.json.get("image_url", cupcake.image_url)

    db.session.commit()

    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)


@app.delete('/api/cupcakes/<int:cupcake_id>')
def delete_cupcake(cupcake_id):
    """Delete a cupcake and return id of deleted cupcake as JSON."""
    cupcake = Cupcake.query.get_or_404(cupcake_id)

    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(deleted=cupcake_id)
