class Piece{
    #color;
    #type;
    #rankCoord;
    #fileCoord;
    #imageSrc;

    constructor(color, type, rankCoord, fileCoord){
        this.#color = color;
        this.#type = type;
        if(color == "w"){
            if(type == "king")
                this.#imageSrc = "assets/w_king.png";
            else
                this.#imageSrc = "assets/w_checker.png";
        } else{
            if(type == "king")
                this.#imageSrc = "assets/b_king.png";
            else
                this.#imageSrc = "assets/b_checker.png";
        }
        this.#rankCoord = rankCoord;
        this.#fileCoord = fileCoord;
    }

    setRankCoord(newRank){
        this.#rankCoord = newRank;
    }

    setFileCoord(newFile){
        this.#fileCoord = newFile;
    }

    promote(){
        this.#type = "king";
        if(this.#color == 'w')
            this.#imageSrc = "assets/w_king.png";
        else
            this.#imageSrc = "assets/b_king.png"; 
    }

    demote(){
        this.#type = "checker";
        if(this.#color == 'w')
            this.#imageSrc = "assets/w_checker.png";
        else
            this.#imageSrc = "assets/b_checker.png";
    }

    getImageSrc(){
        return this.#imageSrc;
    }

    getColor(){
        return this.#color;
    }

    getType(){
        return this.#type;
    }

    getRankCoord(){
        return this.#rankCoord;
    }

    getFileCoord(){
        return this.#fileCoord;
    }

}