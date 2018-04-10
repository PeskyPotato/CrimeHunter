/**
 Copyright (c) 2017 Bogdan Kurinnyi (bogdankurinniy.dev1@gmail.com)
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var ScoreBoard = function(game, conf) {
    this.game = game;
    this.group = game.add.group();

    this.defaults = {
        R: 10,
        x: 140,
        y: 40,
        margin: {
            x: 0,
            y: 22
        },
        width: 210,
        height: 16,
        color: {
            border: 0x0f6afc,
            rect: 0xff0000
        },
        scale: 1,
        label: "Scoreboard",
        fixToCamera: true,
    };
    conf = conf || {};
    this.conf = Object.assign(this.defaults, conf);

    this._offset = {
        x: 0,
        y: 0
    };
    this.group.scale.setTo(this.conf.scale);

    this._subscribers = [];

    if (this.conf.label !== false) {
        this._drawLabel();
    }

    if (this.conf.fixToCamera) {
        this.setFixedToCamera(true);
    }

    this.hide();
};

ScoreBoard.prototype.constructor = ScoreBoard;

ScoreBoard.prototype._getDrawBoxes = function() {
    return this.group.children.filter(function(el) {
        return el.name === "drawBox";
    }) || [];
};

/**
 * Redraw cells with new data
 * @param {array||string} dataArr data for cell
 * @returns {undefined}
 */
ScoreBoard.prototype.redraw = function(dataArr) {
    if (!Array.isArray(dataArr) || Array.isArray(dataArr) && dataArr.length === 0) {
        return
    }
    this.show();
    var inC = (this.conf.label !== false) ? 1 : 0,
        boxes = this.group.children;
    if (boxes.length - inC === 0) {
        this.draw(dataArr);
    } else if (boxes.length - inC < dataArr.length) {
        for (var i = inC; i < boxes.length; i++) {
            boxes[i].children[1].text = dataArr[i - inC];
        }
        this.draw(dataArr.slice(boxes.length - inC));
    } else if (boxes.length - inC > dataArr.length) {
        for (var i = inC; i < dataArr.length; i++) {
            boxes[i].children[1].text = dataArr[i - inC];
        }
        var children = this.group.children.splice(dataArr.length + inC);
        for (var j = 0; j < children.length; j++) {
            children[j].destroy();
            this.__removeOffset();
        }
    } else {
        for (var i = inC; i < boxes.length; i++) {
            boxes[i].children[1].text = dataArr[i - inC];
        }
    }
};

/**
 * Draw to cell
 * @param {array||string} dataArr data for cell
 * @returns {undefined}
 */
ScoreBoard.prototype.draw = function(dataArr) {
    dataArr = (!Array.isArray(dataArr) && typeof dataArr === "string") ? [dataArr] : dataArr;
    for (var i = 0; i < dataArr.length; i++) {
        this._drawBox(dataArr[i]);
    }
    this.show();
};

/**
 * Clear cells
 * @returns {undefined}
 */
ScoreBoard.prototype.clear = function() {
    var el;
    var i = this.group.children.length;
    while (i--) {
        if (this.group.children[i].name === "drawBox") {
            el = this.group.children.splice(i, 1);
            el[0].destroy();
            this.__removeOffset();
        }
    }
    this.hide();
};

/**
 * Increase offset between margins
 * @returns {undefined}
 */
ScoreBoard.prototype.__addOffset = function() {
    this._offset.x += this.conf.margin.x;
    this._offset.y += this.conf.margin.y;
};

/**
 * Decreate offset between margins
 * @returns {undefined}
 */
ScoreBoard.prototype.__removeOffset = function() {
    this._offset.x -= this.conf.margin.x;
    this._offset.y -= this.conf.margin.y;
};

/**
 * Draw header label and attach to board
 * @returns {undefined}
 */
ScoreBoard.prototype._drawLabel = function() {
    var text = this.game.add.text(this.conf.x + this._offset.x + this.conf.width / 2, this.conf.y + this._offset.y, this.conf.label);
    text.stroke = '#000000';
    text.font = '30px Arial';
    text.strokeThickness = 4;
    text.fill = '#ffffff';
    text.anchor.set(0.5, 0);
    this._offset.y += text.height / 2;

    this.__addOffset();
    this.group.add(text);
};

/**
 * Draw box and attach to board
 * @returns {undefined}
 */
ScoreBoard.prototype._drawBox = function(stroke) {
    var gridSize = 2;
    var boxGr = this.game.add.group();
    boxGr.name = "drawBox";

    boxGr.inputEnableChildren = true;
    boxGr.onChildInputOver.add(item => {
        if (item instanceof Phaser.Graphics) {
            item.graphicsData[0].fillAlpha = 0.7;
        } else {
            item.parent.children[0].graphicsData[0].fillAlpha = 0.7;
        }
    }, this.game);
    boxGr.onChildInputOut.add(item => {
        if (item instanceof Phaser.Graphics) {
            item.graphicsData[0].fillAlpha = 1;
        } else {
            item.parent.children[0].graphicsData[0].fillAlpha = 1;
        }
    }, this.game);

    var gr = this.game.add.graphics();
    gr.beginFill(this.conf.color.rect);
    gr.lineStyle(gridSize, this.conf.color.border, 1);
    gr.drawRoundedRect(this.conf.x + this._offset.x, this.conf.y + this._offset.y, this.conf.width, this.conf.height, this.conf.R);
    gr.endFill();
    boxGr.add(gr);

    var text = this.game.add.text(this.conf.x + this._offset.x + this.conf.width / 2, this.conf.y + this._offset.y, stroke);
    text.anchor.set(0.5, 0);
    text.fontSize = this.conf.height - gridSize;
    boxGr.add(text);

    this.group.add(boxGr);
    this.__addOffset();
};

/**
 * Set position of current board
 * @param {number} x Coordinate on x axe
 * @param {number} y Coordinate on y axe
 * @returns {undefined}
 */
ScoreBoard.prototype.setPosition = function(x, y) {
    this.group.x = x;
    this.group.y = y;
};

/**
 * Fix board to camera
 * @param {boolean} fixedToCamera Need to fix to camera or not
 * @returns {undefined}
 */
ScoreBoard.prototype.setFixedToCamera = function(fixedToCamera) {
    this.group.fixedToCamera = fixedToCamera;
};

/**
 * Show display of current board
 * @returns {undefined}
 */
ScoreBoard.prototype.show = function() {
    this.group.visible = true;
};

/**
 * Hide display of current board
 * @returns {undefined}
 */
ScoreBoard.prototype.hide = function() {
    this.group.visible = false;
};

/**
 * Destroy current board on canvas
 * @returns {undefined}
 */
ScoreBoard.prototype.destroy = function() {
    this.group.destroy();
};
