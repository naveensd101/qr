const version = 21;
const squareSize = 5;
const scaleUP = 5;
const quiteZone = 15;

function initialize() {
    let qr = new Array(21);
    for (let i = 0; i < version; ++i) {
        tmp = new Array(21);
        for (let j = 0; j < version; ++j) {
            // tmp[j] = (i + j) % 2;
            tmp[j] = 0;
        }
        qr[i] = tmp;
    }
    return qr;
}

function maskPattern(qr) {
    for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 21; j++) {
            // if ((i + j) % 2 === 0) {
            //     qr[i][j] = 1;
            // }
            // if ((i + j) % 2 == 0) {
            //     qr[i][j] = 1;
            // }
            if ((i * j) % 6 == 0) {
                qr[i][j] = 1;
            }
        }
    }
}

function maskIdentifier(qr) {
    qr[8][2] = 1;
    qr[8][4] = 1;
}

function display(qr) {
    for (let i = 0; i < version; i++) {
        for (let j = 0; j < version; j++) {
            if (qr[i][j]) {
                fill(0);
            } else {
                fill(255);
            }
            square(j * squareSize * scaleUP, i * squareSize * scaleUP, squareSize * scaleUP)
        }
    }
}
function finderPattern(qr) {
    // black outer rings 
    for (let i = 0; i < 7; i++) {
        //top-left
        qr[i][0] = 1;
        qr[i][6] = 1;
        qr[0][i] = 1;
        qr[6][i] = 1;

        //top-right
        qr[i][version - 1] = 1;
        qr[i][version - 1 - 6] = 1;
        qr[0][version - 1 - i] = 1;
        qr[6][version - 1 - i] = 1;

        //bottom-left
        qr[version - 1 - i][0] = 1;
        qr[version - 1 - i][6] = 1;
        qr[version - 1][i] = 1;
        qr[version - 1 - 6][i] = 1;
    }
    // white inner rings
    for (let i = 0; i < 5; i++) {
        //top-left
        qr[i + 1][1] = 0;
        qr[i + 1][5] = 0;
        qr[1][i + 1] = 0;
        qr[5][i + 1] = 0;

        // top right
        qr[i + 1][19] = 0;
        qr[i + 1][15] = 0;
        qr[1][19 - i] = 0;
        qr[5][19 - i] = 0;

        // bottom left
        qr[15 + i][1] = 0;
        qr[15 + i][5] = 0;
        qr[19][i + 1] = 0;
        qr[19 - 4][i + 1] = 0;

    }
    // white outer ring
    for (let i = 0; i < 8; i++) {
        // top left
        qr[7][i] = 0;
        qr[i][7] = 0;

        // top right
        qr[7][version - 1 - i] = 0;
        qr[i][version - 1 - 7] = 0;

        // bottom left
        qr[version - 1 - 7][i] = 0;
        qr[version - 1 - i][7] = 0;
    }
    // white outer outer ring
    for (let i = 0; i < 9; i++) {
        // top left
        qr[8][i] = 0;
        qr[i][8] = 0;

        // top right
        qr[8][version - 1 - i] = 0;

        // bottom left
        qr[version - 1 - i][8] = 0;

    }

    // black inner ring corners
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            qr[i + 2][j + 2] = 1;
            qr[i + 2][version - 1 - j - 2] = 1;
            qr[version - 1 - i - 2][j + 2] = 1;
        }
    }

    // alternate black stuff
    for (let i = 0; i < 8; i+=2) {
        qr[6][8 + i] = 1;
        qr[8 + i][6] = 1;
    }
    // alternate white stuff
    for (let i = 9; i <= 12; i+=2) {
        qr[6][i] = 0;
        qr[i][6] = 0;
    }
}

function hardcodeFormatInformation(qr) {
    // horizontal
    qr[8][0] = 1;
    qr[8][1] = 1;
    qr[8][2] = 0;
    qr[8][3] = 0;
    qr[8][4] = 0;
    qr[8][5] = 0;
    qr[8][7] = 1;

    qr[8][20] = 0;
    qr[8][19] = 1;
    qr[8][18] = 0;
    qr[8][17] = 1;
    qr[8][16] = 0;
    qr[8][15] = 1;
    qr[8][14] = 0;
    qr[8][13] = 1;

    // vertical
    qr[0][8] = 0;
    qr[1][8] = 1;
    qr[2][8] = 0;
    qr[3][8] = 1;
    qr[4][8] = 0;
    qr[5][8] = 1;

    qr[7][8] = 0;
    qr[8][8] = 1;

    qr[14][8] = 1;
    qr[15][8] = 0;
    qr[16][8] = 0;
    qr[17][8] = 0;
    qr[18][8] = 0;
    qr[19][8] = 1;
    qr[20][8] = 1;




}

function encodeText(text) {
    let encoded = [];
    for (let i = 0; i < text.length; i++) {
        let binary = text.charCodeAt(i).toString(2);
        while (binary.length < 8) {
            binary = '0' + binary;
        }
        for (let j = 7; j >= 0; j--) {
            encoded.push(binary[j]);
        }
    }
    encoded = encoded.concat(['0', '0', '0', '0']);
    return encoded;
}

function addDataToQr(qr, data, type = 'byte') {
    prefix = {
        'byte': ['0', '1', '0', '0']
    };
    data = prefix[type].concat(data);

    var coords = {
    }
    coords.r = 20;
    coords.c = 20;
    let dataIdx = 0;
    let direction = 'up';
    while (dataIdx < data.length) {
        // setting the data
        console.log(coords)
        if (data[dataIdx] === '1') {
            qr[coords.r][coords.c] ^= 1;
        } else {
            qr[coords.r][coords.c] ^= 0;
        }
        dataIdx += 1;
        console.log(dataIdx);
        
        // moving the pointer
        if (direction === 'up') {
            // if even column then go left
            if (coords.c % 2 === 0) {
                coords.c -= 1;
            } 
        else {
                coords.c += 1;
                coords.r -= 1;
            }
        }
        if (coords.r < 8) {
            break
        }
    }

    

    console.log(data);
}

function setup() { 
    createCanvas(version * squareSize * scaleUP + quiteZone * scaleUP, version * squareSize * scaleUP + quiteZone * scaleUP);
    noStroke();
    background(255);
    translate (quiteZone * scaleUP / 2, quiteZone * scaleUP / 2)




    qr = initialize();
    maskPattern(qr);
    finderPattern(qr);

    hardcodeFormatInformation(qr);


    console.log(qr);
    // console.log(encodeText('Hello World'));
    addDataToQr(qr, encodeText('a'));
    display(qr);
}
  
function draw() {
}
