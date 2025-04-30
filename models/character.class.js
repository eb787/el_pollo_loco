//durch extends MovableObject wird die Klasse Character von der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject erbt und zusätzlich eigene Eigenschaften und Methoden hinzufügen kann.
class Character extends MovableObject {

constructor(){
    super().loadImage('img/2_character_pepe/2_walk/W-21.png')
}

  jump() {

  }

}
