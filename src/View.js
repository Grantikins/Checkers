class View{
    #canvas;
    #context;
    #board;
    #moveText;

    constructor(){
        this.#canvas = document.getElementById("viewport");
        this.#context = this.#canvas.getContext("2d");
        this.#board = "assets/board.png";
        this.#moveText = document.getElementById("moveText");
        this.drawPieces();
    }

    drawImageToCanvas(imageSrc, xPos, yPos, width, height){
        var image = new Image(width, height);
        image.src = imageSrc;
        this.#context.drawImage(image, xPos, yPos, width, height);
    }

    drawPieces(){
        let pieces = game.getPieces();
        for(let i = 0; i < pieces.length; i++){
            this.drawImageToCanvas(pieces[i].getImageSrc(), pieces[i].getFileCoord() * 75 + 10, pieces[i].getRankCoord() * 75 + 10, 50, 50);
        }
    }

    drawHighlight(){
        if(game.getSelectedPiece() != null){
            this.#context.fillStyle = 'rgba(150, 150, 150, 0.5)';
            this.#context.fillRect(game.getSelectedPiece().getFileCoord() * 75, game.getSelectedPiece().getRankCoord() * 75, 75, 75);
        }
    }

    updateMoveText(){
        if(game.isOver()){
            if(game.getWinner() == 'w') this.#moveText.innerHTML = `White Wins!!`;
            else this.#moveText.innerHTML = `Black Wins!!`;
        }
        else if(game.playerTurn() == 'w') this.#moveText.innerHTML = `White's Move`;
        else this.#moveText.innerHTML = `Black's Move`;
    }

    update(){
        this.drawImageToCanvas(this.#board, 0, 0, 600, 600);
        this.drawHighlight();
        this.drawPieces();
        this.updateMoveText();
    }

}

const view = new View();