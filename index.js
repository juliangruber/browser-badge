var fs = require('fs');
var Canvas = require('canvas');
var through = require('through');

module.exports = function (browsers) {
    var browserNames = Object.keys(browsers);
    var width = browserNames.length * 51 + 10;
    
    var canvas = new Canvas(width, 120);
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgb(191,191,191)';
    round(ctx, 0, 0, width, 120, 20);
    ctx.fill();
    
    ctx.fillStyle = 'rgb(31,31,31)';
    round(ctx, 2, 2, width - 4, 120 - 4, 20);
    ctx.fill();
    
    var stream = through();
    
    (function next (ix) {
        var name = browserNames[ix];
        if (!name) return canvas.createPNGStream().pipe(stream);
        
        var file = __dirname + '/static/' + name + '.png';
        fs.readFile(file, 'base64', function (err, data) {
            if (err) return stream.emit('error', err);
            
            var img = new Canvas.Image;
            img.src = 'data:image/png;base64,' + data;
            
            var x = 5 + 51 * ix + (51 - img.width * 0.5) / 2;
            var w = img.width * 0.5;
            var h = img.height * 0.5;
            
            ctx.drawImage(img, x, 5, w, h);
            drawVersions(ctx, browsers[name], 5 + 51 * ix);
            
            next(ix + 1);
        });
    })(0);
    
    return stream;
};

function drawVersions (ctx, versions, x) {
    var keys = Object.keys(versions).sort();
    keys.forEach(function (key, i) {
        ctx.fillStyle = versions[key]
            ? 'rgb(51,255,26)' // ok -> * green
            : 'rgb(255,51,26)' // fail -> x red
        ;
        var t = (versions[key] ? '•' : 'x') + key;
        
        var y = 55 + i * 14;
        ctx.fillText(t, x, y);
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
