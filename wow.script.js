window.onload = function() {
    var toggleMouseDown = true;
    var toggleTimer = -1;
    var headerArrow = document.querySelector('#arrow');
    var header = document.getElementsByTagName('header')[0];

    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('mousedown', onMouseDown, false);

    function onMouseClick(e) {
  
        e.stopPropagation();
        toggleMouseDown = true;

        if (e.target === headerArrow && toggleMouseDown) {
            if (header.className === '') {
                clearTimeout(toggleTimer);

                toggleMouseDown = false;
                toggleTimer = setTimeout(function() {
                    header.setAttribute('class', 'animate');
                    headerArrow.setAttribute('class', 'animate');
                }, 1000/60);
            } else if (header.className === 'animate') {
                clearTimeout(toggleTimer);

                toggleTimer = setTimeout(function() {
                    header.setAttribute('class', '');
                    headerArrow.setAttribute('class', '');
                }, 1000/60);
            }
        }
    }

    function onMouseDown(e) {

        e.stopPropagation();

        removeEventListener('click', onMouseClick, false);
        if (e.target !== headerArrow) {
            clearTimeout(toggleTimer);

            toggleTimer = setTimeout(function() {
                header.setAttribute('class', '');
                headerArrow.setAttribute('class', '');
            }, 1000/60);
        } else  if (!toggleMouseDown) {
            toggleMouseDown = true;
            clearTimeout(toggleTimer);
            header.setAttribute('class', 'animate');
            headerArrow.setAttribute('class', 'animate');
        }
    }

    function getArrow(elt) {
        var supportCSS3 = document.body.style['MozPerspective'] !== undefined ||
                          document.body.style['webkitPerspective'] !== undefined;

        if (supportCSS3) {
            var selector = document.querySelectorAll(elt);
            var nodeLength = selector.length;

            for (var i=0; i< nodeLength; i++) {
                var node = selector[i];
                if (node.className && !node.class.match('/animate/g')) {
                    node.className += 'animate';
                    node.innerHTML = '<span data-name="' + node.text + '">' + node.innerHTML + '</span>';
                }
            }
        }
    }    
};

var NOISE = { 'Revision' : '0.1'};

var NOISE = NOISE || { };
NOISE.Perlin = (function() {
    var iOctaves = 1,
        fPersistence = 0.2,
        fResult, fFreq, fPers,
        aOctFreq,
        aOctPers,
        fPersMax;

    var octaveFreq = function() {
        var fFreq, fPers;
        aOctFreq = new Array();
        aOctPers = new Array();
        fPersMax = 0;

        for (var i=0; i < iOctaves; i++) {
            fFreq = Math.pow(2,i);
            fPers = Math.pow(fPersistence, i);
            fPersMax += fPers;
            aOctFreq.push(fFreq);
            aOctPers.push(fPers);
        }

        fPersMax = 2 / fPersMax;
    }

    var perm = new Uint8Array(512);
    var p = new Uint8Array(256);

    var grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];

    function dot2(g, x, y) {
        return g[0]*x + g[1]*y;
    }

    function dot3(g, x, y, z) {
        return g[0]*x + g[1]*y + g[2]*z;
    }

    function seed(x) {
        x = (x<<13) ^ x;
        return ( 1.0 - ( (x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
    }

    function init() {
        for (var i = 0; i < 256; i++) {
            p[i] = Math.abs(~~(seed(i) * 256));
        }

        for (var i=0; i < 512; i++) {
            perm[i] = p[i & 255];
        }
    }

    function noise2D (x, y, z) {

        var X = Math.floor(x) & 255;
        var Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        var fade = function(t) {
            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        };

        var lerp = function(a, b, t) {
            return (1.0-t)*a + t*b;
        }

        var u = fade(x),
            v = fade(y);

        var n00 = perm[X   + perm[Y  ]] % 12;
        var n01 = perm[X   + perm[Y+1]] % 12;
        var n10 = perm[X+1 + perm[Y+1]] % 12;
        var n11 = perm[X+1 + perm[Y+1]] % 12;
        var gi00 = dot2(grad3[n00], x,   y  );
        var gi01 = dot2(grad3[n01], x,   y-1);
        var gi10 = dot2(grad3[n10], x-1, y  );
        var gi11 = dot2(grad3[n11], x-1, y-1);

        return lerp(
            lerp(gi00, gi10, u),
            lerp(gi01, gi11, u),
        v);
    }

    function noise3D (x, y, z) {

        var X = Math.floor(x) & 255;
        var Y = Math.floor(y) & 255;
        var Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        var fade = function(t) {
            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        };

        var lerp = function(a, b, t) {
            return (1.0-t)*a + t*b;
        }

        var u = fade(x),
            v = fade(y),
            w = fade(z);

        var n000 = perm[X + perm[Y + perm[Z  ]]] % 12;
        var n001 = perm[X + perm[Y + perm[Z+1]]] % 12;
        var n010 = perm[X + perm[Y+1+perm[Z  ]]] % 12;
        var n011 = perm[X + perm[Y+1+perm[Z+1]]] % 12;
        var n100 = perm[X+1+perm[Y + perm[Z  ]]] % 12;
        var n101 = perm[X+1+perm[Y + perm[Z+1]]] % 12;
        var n110 = perm[X+1+perm[Y+1+perm[Z  ]]] % 12;
        var n111 = perm[X+1+perm[Y+1+perm[Z+1]]] % 12;

        var gi000 = dot3(grad3[n000], x,   y,   z  );
        var gi001 = dot3(grad3[n001], x,   y,   z-1);
        var gi010 = dot3(grad3[n010], x,   y-1, z  );
        var gi011 = dot3(grad3[n011], x,   y-1, z-1);
        var gi100 = dot3(grad3[n100], x-1, y,   z  );
        var gi101 = dot3(grad3[n101], x-1, y,   z-1);
        var gi110 = dot3(grad3[n110], x-1, y-1, z  );
        var gi111 = dot3(grad3[n111], x-1, y-1, z-1);

        return lerp(
            lerp(
              lerp(gi000, gi100, u),
              lerp(gi001, gi101, u), w),
            lerp(
              lerp(gi010, gi110, u),
              lerp(gi011, gi111, u), w),
        v);
    }    

    function PerlinNoise() {}

    PerlinNoise.prototype = {
        init : init,

        noise : function(x, y, z) {
            fResult = 0;

            for (var i=0; i < iOctaves; i++) {
                fFreq = aOctFreq[i];
                fPers = aOctPers[i];

                switch(arguments.length) {
                    case 3 : fResult += fPers * noise3D(fFreq*x, fFreq*y, fFreq*z);
                        break;
                    case 2 : fResult += fPers * noise2D(fFreq*x, fFreq*y);
                        break;
                    default : fResult += fPers * noise3D(fFreq*x, fFreq*y, fFreq*z);
                        break;
                }
            }

            return (fResult * fPersMax + 0.8) * 0.5
        },

        noiseDetail : function(octaves, persistance) {
            iOctaves = octaves || iOctaves;
            fPersistence = persistance || fPersistence;
            octaveFreq();
        }
    }

    return PerlinNoise;

}).call(this);

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var perlin = new NOISE.Perlin();
perlin.init();
perlin.noiseDetail(2, 4.8);

var canvas = document.createElement('canvas');
canvas.setAttribute('width', '420');
canvas.setAttribute('height', '380');
canvas.setAttribute('id', 'canvas');
var canvasWidth = canvas.width = canvas.getAttribute('width');
var canvasHeight = canvas.height = canvas.getAttribute('height');
var mainContext = document.getElementsByClassName('context')[0];

mainContext.appendChild(canvas);

var ctx = canvas.getContext('2d');
ctx.scale(2,2);
var cx = 0, 
    cy = 0, 
    lastX = 0, 
    lastY = 0,
    dx = 0, 
    dy = 0;

var valx = 1, valy = 1;
var curx = 0, cury = 0;
var mouseDown = false;

var image = ctx.createImageData(canvasWidth, canvasHeight);
var noisemap = ctx.createImageData(64, 64);
var pixels = image.data;

var w = canvas.width;
var h = canvas.height;

var map = new Array(64 * 64 * 64);
var texmap = new Array(16 * 16 * 3 * 16);

var fTime = 0, fDeltaT = 0, fLastTime = 0;

if (!this.millis) {
    var millis = function() {
        return new Date().getTime();
    };
}

function getScrollX() {
    return window.pageXOffset || window.document.documentElement.scrollLeft;
}

function getScrollY() {
    return window.pageYOffset || window.document.documentElement.scrollTop;
}

function getMousePos(event) {    
    event.preventDefault();
    dx = event.pageX - (getScrollX() + canvas.getBoundingClientRect().left);
    dy = event.pageY - (getScrollY() + canvas.getBoundingClientRect().top) ;        
    lastX = event.pageX - (getScrollX() + canvas.getBoundingClientRect().left) - cx;
    lastY = event.pageY - (getScrollY() + canvas.getBoundingClientRect().top) - cy;    

    return {
        x: lastX,
        y: lastY
    }    
}

function getTouchPos(event) {    
    event.preventDefault();
    dx = event.changedTouches[0].pageX - (getScrollX() + canvas.getBoundingClientRect().left) - lastX;
    dy = event.changedTouches[0].pageY - (getScrollY() + canvas.getBoundingClientRect().top) - lastY;    
    lastX = event.changedTouches[0].pageX - (getScrollX() + canvas.getBoundingClientRect().left);
    lastY = event.changedTouches[0].pageY - (getScrollY() + canvas.getBoundingClientRect().top);        

    lastX = lastX > 0 ? (lastX < canvas.width ? lastX : canvas.width) : 0;
    lastY = lastY > 0 ? (lastY < canvas.height ? lastY : canvas.height) : 0;        

    return {
        x: lastX,
        y: lastY
    }    
}

window.addEventListener('resize', function() {        
    var canvasWidth = window.getComputedStyle(canvas, null).getPropertyValue('width');
    var canvasHeight = window.getComputedStyle(canvas, null).getPropertyValue('height');
    canvasWidth = parseInt(canvasWidth.substring(-2));
    canvasHeight = parseInt(canvasHeight.substring(-2));  

    var container = document.getElementsByClassName('wrapper')[0];    
    container.style.top = ( window.innerHeight - canvasHeight ) / 2 + 'px';        
});

canvas.addEventListener('mousemove', onMouseMove);

canvas.addEventListener('mousedown', function(event) {    
    event.preventDefault();
    cx = event.pageX - (getScrollX() + canvas.getBoundingClientRect().left) - lastX;
    cy = event.pageY - (getScrollY() + canvas.getBoundingClientRect().top) - lastY;    
    mouseDown = true;    
});

canvas.addEventListener('mouseup', function(event) {
    event.preventDefault();
    mouseDown = false;
});


canvas.addEventListener('touchstart', function(event) {    
    event.preventDefault();    
    lastX = event.changedTouches[0].pageX - (getScrollX() + canvas.getBoundingClientRect().left);
    lastY = event.changedTouches[0].pageY - (getScrollY() + canvas.getBoundingClientRect().top);            
    mouseDown = true;      
});

canvas.addEventListener('touchmove', onTouchMove);

canvas.addEventListener('touchend', function(event) {    
    event.preventDefault();
    mouseDown = false;
});

function onMouseMove(e) {
    if (getMousePos(e).y <= 40) return;  
    if (mouseDown) {                        
        valx = getMousePos(e).x * 0.006; 
        valy = getMousePos(e).y * 0.008;
        
    } else {
        if (dx == undefined) return;        
    }       
}

function onTouchMove(e) {
    if (getTouchPos(e).y <= 40) return;    
    if (mouseDown) {                        
        valx = getMousePos(e).x * 0.006; 
        valy = getMousePos(e).y * 0.008;     
    } else {
        if (dx == undefined) return;        
    }
}

function initTexMap() {
    for ( var i = 1; i < 16; i++) {
        var br = 255 - ((Math.random() * 96) | 0);
        for ( var y = 0; y < 16 * 3; y++) {
            for ( var x = 0; x < 16; x++) {
                var color = 0x966C4A;
                if (i == 4)
                    color = 0x7F7F7F;
                if (i != 4 || ((Math.random() * 3) | 0) === 0) {
                    br = 255 - ((Math.random() * 96) | 0);
                }
                if ((i == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 18)) {
                    color = 0x6AAA40;
                } else if ((i == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 19)) {
                    br = br * 2 / 3;
                }
                if (i == 7) {
                    color = 0x675231;
                    if (x > 0 && x < 15
                            && ((y > 0 && y < 15) || (y > 32 && y < 47))) {
                        color = 0xBC9862;
                        var xd = (x - 7);
                        var yd = ((y & 15) - 7);
                        if (xd < 0)
                            xd = 1 - xd;
                        if (yd < 0)
                            yd = 1 - yd;
                        if (yd > xd)
                            xd = yd;

                        br = 196 - ((Math.random() * 32) | 0) + xd % 3 * 32;
                    } else if (((Math.random() * 2) | 0) === 0) {
                        br = br * (150 - (x & 1) * 100) / 100;
                    }
                }

                if (i == 5) {
                    color = 0xB53A15;
                    if ((x + (y >> 2) * 4) % 8 === 0 || y % 4 === 0) {
                        color = 0xBCAFA5;
                    }
                }
                if (i == 9) {
                    color = 0x4040ff;
                }
                var brr = br;
                if (y >= 32)
                    brr /= 2;

                if (i == 8) {
                    color = 0x50D937;
                    if (((Math.random() * 2) | 0) === 0) {
                        color = 0;
                        brr = 255;
                    }
                }                

                var col = (((color >> 16) & 0xff) * brr / 255) << 16
                        | (((color >> 8) & 0xff) * brr / 255) << 8
                        | (((color) & 0xff) * brr / 255);
                texmap[x + y * 16 + i * 256 * 3] = col;
            }
        }
    }
}

function initMap() {

    for (var cell = 0; cell < pixels.length; cell += 4) {
        var ii = Math.floor(cell/4);
        var x = ii % canvasWidth;
        var y = Math.floor(ii / canvasWidth);
        var xx = 123 + x * .02;
        var yy = 324 + y * .02;
        
        var value = Math.floor((perlin.noise(xx,yy,1))*256);              
        pixels[cell] = pixels[cell + 1] = pixels[cell + 2] = value;
        pixels[cell + 3] = 255;
    }

    for ( var z = 0; z < 128; z++) {        
        for (x = 0; x < 64; x++) {
            for (y = 0; y < 64; y++) {            
                i = z << 12 | y << 6 | x;
                var yd = (y - 32.5) * 0.4;
                var zd = (z - 32.5) * 0.4;
                map[i] = Math.random() * 16 | 0;
                var r = (pixels[x + y * w] * 4 + 0) & 0xff;
                var g = (pixels[x + y * w] * 4 + 1) & 0xff;
                var b = (pixels[x + y * w] * 4 + 2) & 0xff;    
                var pixelCol = r << 16 | g << 8 | b;

                i = z << 12 | y << 6 | x;
                if (map[i] == 0 && y > 2174564)
                    map[i] = 9;
                else if (map[i] != 0) {
                    var j = z << 12 | (y-1) << 6 | x;
                    if (map[j] == 0) {
                        map[i] = 1;
                    } else {
                        j = z << 12 | (y-2) << 6 | x;
                        if (map[j] == 0)
                            map[i] = 2;                       
                    }
                } 
                           
                if (Math.random() > Math.sqrt(Math.sqrt(yd * yd + zd * zd)) - 0.8 &&                    
                  ((pixelCol & 0xff * 0.5) < (64 - y) << 2)) {
                    map[i] = 0;
                }             
            }
        }
    }
}

function renderMinecraft() {    
    curx += (valx - curx) * 0.2;
    cury += (valy - cury) * 0.2;

    var xRot = Math.sin(Date.now() % 10000 / 10000 * Math.PI * 2) * (curx * 0.5) + Math.PI / 2;
    var yRot = Math.cos(Date.now() % 10000 / 10000 * Math.PI * 2) * 0.2;
    var yCos = Math.cos(yRot);
    var ySin = Math.sin(yRot);
    var xCos = Math.cos(xRot);
    var xSin = Math.sin(xRot);
    
    var ox = 32.5 + Date.now() % 10000 / 10000 * 64;
    var oy = 32.5 + (cury * 0.2);
    var oz = 32.5;

    
    for ( var x = 0; x < w; x++) {
        var ___xd = (x - w / 2) / h;
        for ( var y = 0; y < h; y++) {
            var __yd = (y - h / 2) / h;
            var __zd = 1;

            var ___zd = __zd * yCos + __yd * ySin;
            var _yd = __yd * yCos - __zd * ySin;

            var _xd = ___xd * xCos + ___zd * xSin;
            var _zd = ___zd * xCos - ___xd * xSin;

            var col = 0;
            var br = 255;
            var ddist = 0;

            var closest = 32;
            for ( var d = 0; d < 3; d++) {
                var dimLength = _xd;
                if (d == 1)
                    dimLength = _yd;
                if (d == 2)
                    dimLength = _zd;

                var ll = 1 / (dimLength < 0 ? -dimLength : dimLength);
                var xd = (_xd) * ll;
                var yd = (_yd) * ll;
                var zd = (_zd) * ll;

                var initial = ox - (ox | 0);
                if (d == 1)
                    initial = oy - (oy | 0);
                if (d == 2)
                    initial = oz - (oz | 0);
                if (dimLength > 0)
                    initial = 1 - initial;

                var dist = ll * initial;

                var xp = ox + xd * initial;
                var yp = oy + yd * initial;
                var zp = oz + zd * initial;

                if (dimLength < 0) {
                    if (d === 0)
                        xp--;
                    if (d === 1)
                        yp--;
                    if (d === 2)
                        zp--;
                }

                while (dist < closest) {
                    var tex = map[(zp & 127) << 12 | (yp & 63) << 6 | (xp & 63)];

                    if (tex > 0) {
                        var u = ((xp + zp) * 16) & 15;
                        var v = ((yp * 16) & 15) + 16;
                        if (d == 1) {
                            u = (xp * 16) & 15;
                            v = ((zp * 16) & 15);
                            if (yd < 0)
                                v += 32;
                        }

                        var cc = texmap[u + v * 16 + tex * 256 * 3];
                        if (cc > 0) {
                            col = cc;
                            ddist = 255 - ((dist / 32 * 255) | 0);
                            br = 255 * (255 - ((d + 2) % 3) * 50) / 255;
                            closest = dist;

                            if (d == 1) {
                                var maxsh = 0.4;
                                var shcorner = 12;
                                tex = map[((zp-1) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp-1) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (u+v)/shcorner));
                                tex = map[((zp+1) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp-1) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (u+16-v)/shcorner));
                                tex = map[((zp-1) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp+1) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (16-u+v)/shcorner));
                                tex = map[((zp+1) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp+1) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (16-u+16-v)/shcorner));  
                                
                                var sh = 5;
                                tex = map[((zp) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp-1) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (u)/sh));
                                tex = map[((zp) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp+1) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (16-u)/sh));
                                tex = map[((zp-1) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (v)/sh));
                                tex = map[((zp+1) & 127) << 12 | ((yp-1) & 63) << 6 | ((xp) & 63)];
                                if (tex>0)
                                    br *= Math.max(maxsh, Math.min(1.0, (16-v)/sh));
                                
                                br = Math.max(br, 120);                            
                            }
                            if (d == 1) {                                                       
                                tex = map[(zp & 127) << 12 | ((yp-2) & 63) << 6 | (xp & 63)];
                                if (tex > 0)
                                    br *= 0.5;
                                else {                                
                                    tex = map[(zp & 127) << 12 | ((yp-3) & 63) << 6 | (xp & 63)];
                                    if (tex > 0)
                                        br *= 0.7;                                   
                               }
                            }
                        }
                    }
                    xp += xd;
                    yp += yd;
                    zp += zd;
                    dist += ll;
                }
            }

            var r = ((col >> 16) & 0xff) * br * ddist / (255 * 255);
            var g = ((col >> 8) & 0xff) * br * ddist / (255 * 255);
            var b = ((col) & 0xff) * br * ddist / (255 * 255);

            if(ddist <= 155) r += 155-ddist;
            if(ddist <= 255) g += 255-ddist;
            if(ddist <= 255) b += 255-ddist;  

            pixels[(x + y * w) * 4 + 0] = r;
            pixels[(x + y * w) * 4 + 1] = g;
            pixels[(x + y * w) * 4 + 2] = b;
        }
    }
}

render();
initTexMap();
initMap();

function render() {
    var id = requestAnimationFrame(render);    
        
    renderMinecraft();
    ctx.putImageData(image, 0, 0);
};