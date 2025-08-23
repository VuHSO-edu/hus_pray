var Sakura = function Sakura(selector, options) {
  
  if (typeof selector === "undefined") {
    throw new Error("No selector present. Define an element.")
  }
  this.el = document.querySelector(selector)
  var defaults = {
    className: "sakura",
    fallSpeed: 1,
    maxSize: 14,
    minSize: 10,
    delay: 300,
    gradientColorStart: "rgba(255, 183, 197, 0.9)",
    gradientColorEnd: "rgba(255, 197, 208, 0.9)",
    gradientColorDegree: 120,
  }
  var extend = function extend(originalObj, newObj) {
    Object.keys(originalObj).forEach((key) => {
      if (newObj && Object.prototype.hasOwnProperty.call(newObj, key)) {
        var origin = originalObj
        origin[key] = newObj[key]
      }
    })
    return originalObj
  }
  this.settings = extend(defaults, options)
  this.el.style.overflowX = "hidden"
  function randomArrayElem(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  var prefixes = ["webkit", "moz", "MS", "o", ""]
  function PrefixedEvent(element, type, callback) {
    for (var p = 0; p < prefixes.length; p += 1) {
      var animType = type
      if (!prefixes[p]) {
        animType = type.toLowerCase()
      }
      element.addEventListener(prefixes[p] + animType, callback, false)
    }
  }
  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
  this.createPetal = () => {
    if (this.el.dataset.sakuraAnimId) {
      setTimeout(() => {
        window.requestAnimationFrame(this.createPetal)
      }, this.settings.delay)
    }
    var animationNames = {
      blowAnimations: ["blow-soft-left", "blow-medium-left", "blow-soft-right", "blow-medium-right"],
      swayAnimations: ["sway-0", "sway-1", "sway-2", "sway-3", "sway-4", "sway-5", "sway-6", "sway-7", "sway-8"],
    }
    var blowAnimation = randomArrayElem(animationNames.blowAnimations)
    var swayAnimation = randomArrayElem(animationNames.swayAnimations)
    var fallTime =
      (document.documentElement.clientHeight * 0.007 + Math.round(Math.random() * 5)) * this.settings.fallSpeed
    var animationsArr = [
      "fall ".concat(fallTime, "s linear 0s 1"),
      ""
        .concat(blowAnimation, " ")
        .concat((fallTime > 30 ? fallTime : 30) - 20 + randomInt(0, 20), "s linear 0s infinite"),
      "".concat(swayAnimation, " ").concat(randomInt(2, 4), "s linear 0s infinite"),
    ]
    var animations = animationsArr.join(", ")
    var petal = document.createElement("div")
    petal.classList.add(this.settings.className)
    var height = randomInt(this.settings.minSize, this.settings.maxSize)
    var width = height - Math.floor(randomInt(0, this.settings.minSize) / 3)
    petal.style.background = "linear-gradient("
      .concat(this.settings.gradientColorDegree, "deg, ")
      .concat(this.settings.gradientColorStart, ", ")
      .concat(this.settings.gradientColorEnd, ")")
    petal.style.webkitAnimation = animations
    petal.style.animation = animations
    petal.style.borderRadius = ""
      .concat(randomInt(this.settings.maxSize, this.settings.maxSize + Math.floor(Math.random() * 10)), "px ")
      .concat(randomInt(1, Math.floor(width / 4)), "px")
    petal.style.height = "".concat(height, "px")
    petal.style.left = "".concat(Math.random() * document.documentElement.clientWidth - 100, "px")
    petal.style.marginTop = "".concat(-(Math.floor(Math.random() * 20) + 15), "px")
    petal.style.width = "".concat(width, "px")
    PrefixedEvent(petal, "AnimationEnd", () => {
      if (!elementInViewport(petal)) {
        petal.remove()
      }
    })
    PrefixedEvent(petal, "AnimationIteration", () => {
      if (!elementInViewport(petal)) {
        petal.remove()
      }
    })
    this.el.appendChild(petal)
  }
  this.el.setAttribute("data-sakura-anim-id", window.requestAnimationFrame(this.createPetal))
}
Sakura.prototype.start = function () {
  var animId = this.el.dataset.sakuraAnimId
  if (!animId) {
    this.el.setAttribute("data-sakura-anim-id", window.requestAnimationFrame(this.createPetal))
  } else {
    throw new Error("Sakura is already running.")
  }
}
Sakura.prototype.stop = function () {
  
  var graceful = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
  var animId = this.el.dataset.sakuraAnimId
  if (animId) {
    window.cancelAnimationFrame(animId)
    this.el.setAttribute("data-sakura-anim-id", "")
  }
  if (!graceful) {
    setTimeout(() => {
      var petals = document.getElementsByClassName(this.settings.className)
      while (petals.length > 0) {
        petals[0].parentNode.removeChild(petals[0])
      }
    }, this.settings.delay + 50)
  }
}
