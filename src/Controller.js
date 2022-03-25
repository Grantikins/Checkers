class Controller{
    #canvas;

    constructor(){
        this.#canvas =  document.getElementById("viewport");
    }

    getMousePos(event){
        const rect = this.#canvas.getBoundingClientRect();
        return {x: event.clientX - rect.left, y: event.clientY - rect.top};
    }
}

const controller = new Controller();