var fs = require('fs');
var Canvas = require('canvas');
var through = require('through');

module.exports = function (browsers) {
    var browserNames = Object.keys(browsers);
    var width = browserNames.length * 104 + 4;
    var height = Math.max.apply(null, browserNames.map(function (name) {
        return Object.keys(browsers[name]).length * 11 * 2 + 116;
    }));
    
    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgb(55,55,55)';
    round(ctx, 0, 0, width, height, 16);
    ctx.fill();
    
    var stream = through();
    
    browserNames.forEach(function (name, ix) {
        ctx.fillStyle = 'rgb(62,62,62)';
        round(ctx, 4 + ix * 104, 4, 100, height - 8, 16);
        ctx.fill();
    });
    
    (function next (ix) {
        var name = browserNames[ix];
        if (!name) return canvas.createPNGStream().pipe(stream);
        
        var file = __dirname + '/static/' + name + '.png';
        fs.readFile(file, 'base64', function (err, data) {
            if (err) return stream.emit('error', err);
            
            var img = new Canvas.Image;
            img.src = 'data:image/png;base64,' + data;
            
            var x = 4 + 104 * ix + (104 - img.width) / 2;
            var w = img.width;
            var h = img.height;
            
            ctx.drawImage(img, x, 10, w, h);
            drawVersions(ctx, browsers[name], 10 + 104 * ix);
            
            next(ix + 1);
        });
    })(0);
    
    return stream;
};

function drawVersions (ctx, versions, x) {
    var keys = Object.keys(versions).sort(function(a, b) {
        return a - b;
    });
    keys.forEach(function (key, i) {
        var v = versions[key];
        var y = 116 + i * 22;
        
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = {
            'true': 'rgb(51,255,26)', // ok -> ✓ green
            'false': 'rgb(255,51,26)', // fail -> ⚑ red
            'pending': 'rgb(150,150,150)', // fail -> ⚑ red
        }[String(v)] || 'rgb(150,150,150)';
        ctx.fillText({
            'true': '✓',
            'false': '⚑',
            'pending': '-'
        }[String(v)] || '?', x, y);
        
        ctx.font = 'normal 20px sans-serif';
        ctx.fillText(key, x + 24, y);
    });
}

function round (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x, y + r);
    
    for (var angle = 0; angle <= 2 * Math.PI; angle += Math.PI / 2) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        
        ctx.arcTo(x, y, x + w * c, y + h * s, r);
        ctx.lineTo(x + c * r, y + s * r);
        
        x += c * w;
        y += s * h;
    }
    ctx.closePath();
}
