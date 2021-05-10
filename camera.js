AFRAME.registerComponent('rotation-reader', {
    tick: function () {
      // `this.el` is the element.
      // `object3D` is the three.js object.
  
      // `rotation` is a three.js Euler using radians. `quaternion` also available.
      //console.log(this.el.object3D.rotation);
      //let rotDict = this.el.object3D.rotation
      //{_x: -0.006, _y: 0.6800000000000002, _z: 0, _order: "YXZ", _onChangeCallback: ƒ, …}
  
      // `position` is a three.js Vector3.
      //console.log(this.el.object3D.position);
      //let textEl = document.querySelector('#mainCamera');
      //textEl.setAttribute("rotation",  rotDict._x.toString() + " " +  rotDict._y.toString() + " " + rotDict._z.toString())
      
    }
  });
  
  // <a-entity camera look-controls rotation-reader>