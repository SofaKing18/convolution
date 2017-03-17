$(document).ready(function() {
    make_base();
});

function make_base() {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');
    base_image = new Image();
    base_image.src = $('#canvas').data('image');
    $('#filter_size').change(function() {
        change_filter()
    });
    base_image.onload = function() {
        context.drawImage(base_image, 0, 0);
        change_filter();
        apply_filter();
    };
    $('#apply').click(function() {
        apply_filter();
    })
    $('#kernel').change(function() {
      change_filter($('#kernel option:selected').data('filter'));
    });
}

function change_filter(filter_s = '') {
    var filter_v;
    if (filter_s=='') {
      filter = parseInt($('#filter_size').val());
    } else {
      filter_v = filter_s.split(' ');
      filter = Math.sqrt(filter_v.length);
    }
    filter_size = [Math.ceil(-((filter) - 1) / 2), Math.ceil(((filter) - 1) / 2)];
    $('.f_v').remove();
    var col_n = 0;
    for (var row = filter_size[0]; row <= filter_size[1]; row++) {
        for (var col = filter_size[0]; col <= filter_size[1]; col++) {
            value = ((filter_v == undefined) ? ((row == 0 && col == 0) ? 1 : 0) : filter_v[col_n]);
            $('.filter_f_vs').append('<input class="f_v" name="' + col_n + '" value="' + value + '"></input>');
            col_n++;
        }
        $('.filter_f_vs').append('<br class="f_v">');
    }
}


function add(a, b) {
    return a + b;
}

function apply_filter() {
    filter = [];
    $('input.f_v').each(function(index) {
        filter.push(parseFloat(this.value))
    });
    percent = 0;
         $('#percent').css("width", 0+"%");
    filter_size = [Math.ceil(-(Math.sqrt(filter.length) - 1) / 2), Math.ceil((Math.sqrt(filter.length) - 1) / 2)];
    // [1 2 3
    //  4 5 6  -> 5 is a middle, row and col = 0, 1 - left corner with index [-1, -1]; 2 => [-1, 0]
    //  7 8 9]
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');
    ImageA = context.getImageData(0, 0, canvas.width, canvas.height);
    ImageB = new ImageData(canvas.width, canvas.height);
    normalize = filter.reduce(add, 0.0);
    correction = (normalize != 0) ? (1 / normalize) : 1;
    // R G B
    $('#canvas2').addClass('applying');
    for (var x_y = 0; x_y <= 4 * (canvas.width - 1) * (canvas.height); x_y += 4) {
        for (channel = 0; channel < 3; channel++) {
            j = filter.length - 1;
            convolution_result = 0;
            for (var row = filter_size[0]; row <= filter_size[1]; row++) {
                for (var col = filter_size[0]; col <= filter_size[1]; col++) {
                    convolution_result += ImageA.data[x_y + 4 * (canvas.width * row + col) + channel] * filter[j];
                    j--;
                }
            }
            ImageB.data[x_y + channel] = correction * convolution_result;
        }
        // A ~ 255
        ImageB.data[x_y + 3] = 255.0;
    }

    document.getElementById('canvas').getContext('2d').putImageData(ImageA, 0, 0);;
    document.getElementById('canvas2').getContext('2d').putImageData(ImageB, 0, 0);
    $('#canvas2').removeClass('applying');
}
