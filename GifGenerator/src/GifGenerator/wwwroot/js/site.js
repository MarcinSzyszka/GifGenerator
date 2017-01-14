$('document').ready(function () {
    var imgForMeme = $('#start-image');
    var canvas = $('#memecanvas');
    var topText = $('#top-text');
    var bottomText = $('#bottom-text');
    var loader = $('.loader');

    imgForMeme.one("load", function () {
        var gifGen = new GifGenerator(canvas[0], imgForMeme[0], topText[0], bottomText[0]);
    }).each(function () {
        if (this.complete || /*for IE 10-*/ $(this).height() > 0)
            $(this).load();
    });

    $('#upload-file-btn').bind('click', function () {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        $(input).bind('change', function (evt) {
            var form = new FormData(document.getElementById('change-image-form'));
            var file = evt.target.files[0];
            form.append("image", file);
            $.ajax({
                url: "api/File",
                type: "POST",
                data: form,
                processData: false,
                contentType: false,
                success: function (result) {
                    loader.css('display', 'inherit')
                    imgForMeme.attr('src', result);
                    setTimeout(function () {
                        var gifGen = new GifGenerator(canvas[0], imgForMeme[0], topText[0], bottomText[0]);
                        loader.css('display', 'none')
                    }, 1000);
                   
                },
                error: function (result) {
                    alert('Something went wrong...');
                }
            });
        });
        input.click();
    });
});


//dealing with canvas
function GifGenerator(canvasElem, imgElem, topTextInput, bottomTextInput) {
    var memeWidth = imgElem.width;
    var memeHeight = imgElem.height;
    // var canvas = document.getElementById('memecanvas');
    var canvas = canvasElem;
    ctx = canvas.getContext('2d');


    // Set the text style to that to which we are accustomed

    canvas.width = memeWidth;
    canvas.height = memeHeight;

    //  Grab the nodes
    // var img = document.getElementById('start-image');
    var img = imgElem;
    var topText = topTextInput;
    var bottomText = bottomTextInput;
    //var topText = document.getElementById('top-text');
    //var bottomText = document.getElementById('bottom-text');

    // When the image has loaded...
    //img.onload = function () {
    //    drawMeme()
    //}

    topText.addEventListener('keydown', drawMeme)
    topText.addEventListener('keyup', drawMeme)
    topText.addEventListener('change', drawMeme)

    bottomText.addEventListener('keydown', drawMeme)
    bottomText.addEventListener('keyup', drawMeme)
    bottomText.addEventListener('change', drawMeme)

    function drawMeme() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 4;
        ctx.font = '20pt sans-serif';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        var text1 = document.getElementById('top-text').value;
        text1 = text1.toUpperCase();
        x = canvas.width / 2;
        y = 0;

        wrapText(ctx, text1, x, y, 300, 28, false);

        ctx.textBaseline = 'bottom';
        var text2 = document.getElementById('bottom-text').value;
        text2 = text2.toUpperCase();
        y = canvas.height;

        wrapText(ctx, text2, x, y, 300, 28, true);

    }

    function wrapText(context, text, x, y, maxWidth, lineHeight, fromBottom) {

        var pushMethod = (fromBottom) ? 'unshift' : 'push';

        lineHeight = (fromBottom) ? -lineHeight : lineHeight;

        var lines = [];
        var y = y;
        var line = '';
        var words = text.split(' ');

        for (var n = 0; n < words.length; n++) {
            var testLine = line + ' ' + words[n];
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth) {
                lines[pushMethod](line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines[pushMethod](line);

        for (var k in lines) {
            context.strokeText(lines[k], x, y + lineHeight * k);
            context.fillText(lines[k], x, y + lineHeight * k);
        }
    }

    drawMeme();
}