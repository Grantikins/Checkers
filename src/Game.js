class Game{
    #pieces = [];
    #board = [[], [], [], [], [], [], [], []];
    #isOver;
    #filesAndRanks = [[0,75], [76,150], [151,225], [226,300], [301,375], [376,450], [451,525], [526,600]];
    #selectedPiece;
    #turn;
    #jumpedPiece;
    #winner;

    constructor(){
        this.#isOver = false;
        this.#selectedPiece = null;
        this.#turn = 0;
        this.setUpPieces();
        this.setUpBoard();
    }

    /**
     * Sets up all of the pieces on the checker board. This method sets up an array of pieces that is to represent the checkers in their starting state.
     */
    setUpPieces(){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(i != 3 && i != 4){
                    if( (i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0) ){
                        if(i < 3)
                            this.#pieces.push(new Piece("b", "checker", i, j));
                        if(i > 4)
                            this.#pieces.push(new Piece("w", "checker", i, j));
                    }
                }
            }
        }  
    }

    /**
     * Sets up the board using the pieces array. The pieces each have a location and the locations determine the board position.
     */
    setUpBoard(){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                this.#board[i][j] = 0;
            }
        }

        this.placePiecesOnBoard();
    }

    /**
     * A helper method for the setUpBoard() method. This is also used when moving pieces.
     */
    placePiecesOnBoard(){
        for(let i = 0; i < this.#pieces.length; i++){
            if(this.#pieces[i].getRankCoord() == 0 && this.#pieces[i].getColor() == "w"){
                this.#pieces[i].promote();
            }

            if(this.#pieces[i].getRankCoord() == 7 && this.#pieces[i].getColor() == "b"){
                this.#pieces[i].promote();
            }

            this.#board[this.#pieces[i].getFileCoord()][this.#pieces[i].getRankCoord()] = this.#pieces[i];
        }
    }

    /**
     * This method selects a square on the board depending on where the user clicks on the canvas. This method is the way of interacting with the board.
     * @param {*} event This is the click event on the canvas  
     */
    selectSquare(event){
        const coords = controller.getMousePos(event);
        const squareCoords = this.findSquare(coords.x, coords.y);
        if(this.#board[squareCoords.x][squareCoords.y] != 0 && this.#selectedPiece != this.#board[squareCoords.x][squareCoords.y])
            this.#selectedPiece = this.#board[squareCoords.x][squareCoords.y];
        else if(this.#board[squareCoords.x][squareCoords.y] == this.#selectedPiece)
            this.#selectedPiece = null;
        else if(this.#selectedPiece instanceof Piece && this.isValidMove(squareCoords.y, squareCoords.x))
            this.moveSelectedPiece(squareCoords.y, squareCoords.x);
    }

    /**
     * A helper method fo the selectSquare() method. This finds the x and y coordinates of the square depending on the location of the click on the canvas.
     * @param {*} x The x coordinate  from the click 
     * @param {*} y The y coordinate from the click
     * @returns the x and y coordinates of the checker board squares
     */
    findSquare(x, y){
        var xCoord, yCoord;
        for(let i = 0; i < 8; i++){
            if(this.#filesAndRanks[i][0] <= x && this.#filesAndRanks[i][1] >= x)
                xCoord = i;
        }

        for(let i = 0; i < 8; i++){
            if(this.#filesAndRanks[i][0] <= y && this.#filesAndRanks[i][1] >= y)
                yCoord = i;
        }

        return {x: xCoord, y: yCoord};
    }

    /**
     * This method takes the currently selected piece from game and moves it to the specified rank and file on the board.
     * @param {*} rank the rank to move the piece to
     * @param {*} file the file to move the piece to
     */
    moveSelectedPiece(rank, file){
        var startRank = this.#selectedPiece.getRankCoord();
        var startFile = this.#selectedPiece.getFileCoord();
        for(let i = 0; i < this.#pieces.length; i++){
            if(this.#pieces[i].getRankCoord() == this.#selectedPiece.getRankCoord() && this.#pieces[i].getFileCoord() == this.#selectedPiece.getFileCoord()){
                this.#pieces[i] = this.#selectedPiece;
                this.#board[this.#selectedPiece.getFileCoord()][this.#selectedPiece.getRankCoord()] = 0;
            }
        }

        this.#selectedPiece.setRankCoord(rank);
        this.#selectedPiece.setFileCoord(file);
        if(this.pieceWasJumped(startRank, startFile, this.#selectedPiece.getRankCoord(), this.#selectedPiece.getFileCoord()))
            this.removeJumpedPiece();
        this.placePiecesOnBoard();
        this.checkForGameOver();
        if( Math.abs(this.#selectedPiece.getRankCoord() - startRank) == 1 && this.hasAnotherJump()){
            this.#turn++;
            this.#selectedPiece = null;
        } else if(!this.hasAnotherJump()){
            this.#turn++;
            this.#selectedPiece = null;
        }
    }

    /**
     * Determines if another jump is available to a piece. This is called when a piece jumps another.
     * @returns true if another jump is available false otherwise
     */
    hasAnotherJump(){
        if(this.isValidSquare(this.#selectedPiece.getRankCoord() + 2, this.#selectedPiece.getFileCoord() + 2) && this.isValidMove(this.#selectedPiece.getRankCoord() + 2, this.#selectedPiece.getFileCoord() + 2)) return true;
        if(this.isValidSquare(this.#selectedPiece.getRankCoord() - 2, this.#selectedPiece.getFileCoord() + 2) && this.isValidMove(this.#selectedPiece.getRankCoord() - 2, this.#selectedPiece.getFileCoord() + 2)) return true;
        if(this.isValidSquare(this.#selectedPiece.getRankCoord() + 2, this.#selectedPiece.getFileCoord() - 2) && this.isValidMove(this.#selectedPiece.getRankCoord() + 2, this.#selectedPiece.getFileCoord() - 2)) return true;
        if(this.isValidSquare(this.#selectedPiece.getRankCoord() - 2, this.#selectedPiece.getFileCoord() - 2) && this.isValidMove(this.#selectedPiece.getRankCoord() - 2, this.#selectedPiece.getFileCoord() - 2)) return true;
        return false;
    }

    /**
     * Determines if the piece referenced by the jumpedPiece variable was actually jumped or not.
     * @param {*} startRank the starting rank of the moved piece
     * @param {*} startFile the starting file of the moved piece
     * @param {*} endRank the ending rank of the moved piece
     * @param {*} endFile the ending file of the moved piece
     * @returns true if the piece was in fact jumped false otherwise
     */
    pieceWasJumped(startRank, startFile, endRank, endFile){
        if( Math.abs(startRank - endRank) == 1 ) return false;

        var jumpedRank = (startRank < endRank) ? startRank + 1 : startRank - 1;
        var jumpedFile = (startFile < endFile) ? startFile + 1 : startFile - 1;

        if(this.#board[jumpedFile][jumpedRank] instanceof Piece) return true;
        
        return false;
    }

    /**
     * This method determines if the currently selected piece and the selected square is a valid move for that piece.
     * @param {*} rank the rank to move to
     * @param {*} file the file to move to 
     */
    isValidMove(rank, file){
        if(this.#selectedPiece.getType() == "king" && this.isSelectedPieceTurn())
            return this.isValidMoveKing(rank, file);
        else if(this.#selectedPiece.getColor() == "w" && this.isSelectedPieceTurn())
            return this.isValidMoveWhite(rank, file);
        else if(this.#selectedPiece.getColor() == "b" && this.isSelectedPieceTurn())
            return this.isValidMoveBlack(rank, file);
        else 
            return false;
    }

    /**
     * This method returns the player whose turn it is.
     * @return the player whose turn it is to play.
     */
    playerTurn(){
        if(this.#turn % 2 == 0)
            return "w";
        else 
            return "b";
    }

    /**
     * This method returns true or false depending on whether it is the turn of the currently selected piece.
     * @return true if it is the selected pieces turn or false otherwise
     */
    isSelectedPieceTurn(){
        if(this.#selectedPiece.getColor() == this.playerTurn())
            return true;
        else
            return false;
    }

    /**
     * Determines if a move is valid for the specified king.
     * @param {*} rank the rank we are trying to move to
     * @param {*} file the file we are trying to move to
     * @returns true if the move is legal/valid false otherwise
     */
    isValidMoveKing(rank, file){
        if(Math.abs(this.#selectedPiece.getFileCoord() - file) == 1 && Math.abs(this.#selectedPiece.getRankCoord() - rank) == 1 && this.#board[file][rank] == 0)
            return true;
        else if( Math.abs(this.#selectedPiece.getFileCoord() - file) > 1 || this.#selectedPiece.getRankCoord() - rank > 1 ){
            if( !( (this.#selectedPiece.getRankCoord() - rank) % 2 == 0 ) ) 
                return false;
            else
                return this.isValidJumpWhite(rank, file) || this.isValidJumpBlack(rank, file);
        }
    }

    /**
     * Determines if the specified square is a valid move for a regular white checker.
     * @param {*} rank the rank we are trying to move to
     * @param {*} file the file we are trying to move to
     * @returns true if it is a legal/valid move false otherwise
     */
    isValidMoveWhite(rank, file){
        if(Math.abs(this.#selectedPiece.getFileCoord() - file) == 1 && this.#selectedPiece.getRankCoord() - rank == 1 && this.#board[file][rank] == 0)
            return true;
        else if( Math.abs(this.#selectedPiece.getFileCoord() - file) > 1 || this.#selectedPiece.getRankCoord() - rank > 1 ){
            if( !( (this.#selectedPiece.getRankCoord() - rank) % 2 == 0 ) ) 
                return false;
            else 
                return this.isValidJumpWhite(rank, file);
        }

        return false;
    }

    /**
     * Determines if the specified square is valid to jump to for a regular white checker. Jump means to jump over another piece.
     * @param {*} rank the rank we are trying to move to
     * @param {*} file the file we are trying to move to
     * @returns true if it is a legal/valid move false otherwise
     */
    isValidJumpWhite(rank, file){
        if(this.#selectedPiece.getFileCoord() < file){
            if(this.#board[this.#selectedPiece.getFileCoord() + 1][this.#selectedPiece.getRankCoord() - 1] instanceof Piece && this.#board[this.#selectedPiece.getFileCoord() + 1][this.#selectedPiece.getRankCoord() - 1].getColor() != this.#selectedPiece.getColor() && this.#board[file][rank] == 0 && this.#board[file - 2][rank + 2] == this.#selectedPiece){
                this.#jumpedPiece = this.#board[this.#selectedPiece.getFileCoord() + 1][this.#selectedPiece.getRankCoord() - 1];
                return true;
            }
            else 
                return false;
        } else if(this.#selectedPiece.getFileCoord() > file){
            if(this.#board[this.#selectedPiece.getFileCoord() - 1][this.#selectedPiece.getRankCoord() - 1] instanceof Piece && this.#board[this.#selectedPiece.getFileCoord() - 1][this.#selectedPiece.getRankCoord() - 1].getColor() != this.#selectedPiece.getColor() && this.#board[file][rank] == 0 && this.#board[file + 2][rank + 2] == this.#selectedPiece){
                this.#jumpedPiece = this.#board[this.#selectedPiece.getFileCoord() - 1][this.#selectedPiece.getRankCoord() - 1];
                return true;
            }
            else 
                return false;
        }
        
        return false;
    }

    /**
     * Determines if the specified square is a valid move for a regular black checker.
     * @param {*} rank the rank we are trying to move to
     * @param {*} file the file we are trying to move to
     * @returns true if it is a legal/valid move false otherwise
     */
    isValidMoveBlack(rank, file){
        if(Math.abs(this.#selectedPiece.getFileCoord() - file) == 1 && this.#selectedPiece.getRankCoord() - rank == -1 && this.#board[file][rank] == 0)
            return true;
        else if(Math.abs(this.#selectedPiece.getFileCoord() - file) > 1 || this.#selectedPiece.getRankCoord() - rank < -1){
            if(!( (this.#selectedPiece.getRankCoord() - rank) % 2 == 0) )
                return false;
            else 
                return this.isValidJumpBlack(rank, file);
        }

        return false;
    }

    /**
     * Determines if the specified square is valid to jump to for a regular black checker. Jump means to jump over another piece.
     * @param {*} rank the rank we are trying to move to
     * @param {*} file the file we are trying to move to
     * @returns true if it is a legal/valid move false otherwise
     */
    isValidJumpBlack(rank, file){
        if(this.#selectedPiece.getFileCoord() < file){
            if(this.#board[this.#selectedPiece.getFileCoord() + 1][this.#selectedPiece.getRankCoord() + 1] instanceof Piece && this.#board[this.#selectedPiece.getFileCoord() + 1][this.#selectedPiece.getRankCoord() + 1].getColor() != this.#selectedPiece.getColor() && this.#board[file][rank] == 0 && this.#board[file - 2][rank - 2] == this.#selectedPiece){
                this.#jumpedPiece = this.#board[this.#selectedPiece.getFileCoord() + 1][this.#selectedPiece.getRankCoord() + 1];
                return true;
            }
            else 
                return false;
        } else if(this.#selectedPiece.getFileCoord() > file){
            if(this.#board[this.#selectedPiece.getFileCoord() - 1][this.#selectedPiece.getRankCoord() + 1] instanceof Piece && this.#board[this.#selectedPiece.getFileCoord() - 1][this.#selectedPiece.getRankCoord() + 1].getColor() != this.#selectedPiece.getColor() && this.#board[file][rank] == 0 && this.#board[file + 2][rank - 2] == this.#selectedPiece){
                this.#jumpedPiece = this.#board[this.#selectedPiece.getFileCoord() - 1][this.#selectedPiece.getRankCoord() + 1];
                return true;
            }
            else 
                return false;
        }
        
        return false;
    }

    /**
     * Removes piece that was jumped over or demotes it if it was a king.
     */
    removeJumpedPiece(){
        if(this.#jumpedPiece != null){
            if(this.#jumpedPiece.getType() == "checker"){
                this.#board[this.#jumpedPiece.getFileCoord()][this.#jumpedPiece.getRankCoord()] = 0;
                for(let i = 0; i < this.#pieces.length; i++){
                    if(this.#pieces[i] == this.#jumpedPiece){
                        this.#pieces.splice(i, 1);
                        this.#jumpedPiece = null;
                    }
                }
            } else{
                this.#jumpedPiece.demote();
            }
        }

        this.#jumpedPiece = null;
    }

    /**
     * This sees if the game is over and if it is, then the gameover variable will be changed
     */
    checkForGameOver(){
        var whites = 0;
        var blacks = 0;
        for(let i = 0; i < this.#pieces.length; i++){
            if(this.#pieces[i].getColor() == 'w') whites++;
            if(this.#pieces[i].getColor() == 'b') blacks++;
        }

        if(whites == 0){
            this.#isOver = true;
            this.#winner = 'b';
        }

        if(blacks == 0){
            this.#isOver = true;
            this.#winner = 'w';
        }
    }

    isValidSquare(rank, file){
        if(rank > 7 || rank < 0) return false;
        if(file > 7 || file < 0) return false;
        return true;
    }

    getPieces(){
        return this.#pieces;
    }

    getSelectedPiece(){
        return this.#selectedPiece;
    }

    getWinner(){
        return this.#winner;
    }

    isOver(){
        return this.#isOver;
    }
}

const game = new Game();