class Main{

    static mainLoop(){
        if(!game.isOver()){
            view.update();
            window.requestAnimationFrame(Main.mainLoop);
        } else{
            view.update();
        }
    }

}

Main.mainLoop();