///////////////
/// VARIABLES
///////////////

// Equivalent d'enumération
var UP=1, DOWN=2, LEFT=4, RIGHT=8;

// Tableau décrivant le labyrinthe
var tab_labyrinthe;
	
// Mémorise les cases sur lesquelles la souris est déjà passée : valeurs false ou true
var tab_case_checked = new Array();

// Tableau des noeuds de chaque case du labyrinthe
var td_elements = document.getElementsByTagName('td');

// Position de la souris et du fromage
var pos_x, cheese_x;
var pos_y, cheese_y;

// Taille du labyrinthe
var size_x;
var size_y;




/////////////////////////////////
/// INITIALISATIONS VARIABLES
/////////////////////////////////

tab_labyrinthe =
[
	[UP+LEFT+DOWN,		UP+DOWN,		UP+DOWN,		UP+DOWN,		UP+DOWN,		UP+DOWN,		UP+RIGHT],
	[UP+LEFT,			UP+RIGHT,		UP+LEFT,		UP,				UP+DOWN,		UP+DOWN,		DOWN+RIGHT],
	[LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT,		LEFT+DOWN,		UP+DOWN,		UP+DOWN,		UP+RIGHT],
	[LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT,		LEFT+UP,		UP,				UP+DOWN,		DOWN+RIGHT],
	[LEFT+RIGHT+DOWN,	LEFT+DOWN,		RIGHT,			LEFT+DOWN+RIGHT,DOWN+LEFT,		UP+DOWN,		UP+DOWN+RIGHT],
	[LEFT+UP,			UP+DOWN,		DOWN,			UP+DOWN,		UP+RIGHT,		UP+LEFT,		UP+RIGHT],
	[LEFT+RIGHT,		UP+LEFT+RIGHT,	LEFT+UP,		UP+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT],
	[LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT,		LEFT+RIGHT],
	[LEFT+RIGHT+DOWN,	LEFT+DOWN,		DOWN+RIGHT,		LEFT+DOWN,		DOWN,			DOWN+RIGHT,		DOWN+LEFT+RIGHT]
];

size_x = tab_labyrinthe[0].length;
size_y = tab_labyrinthe.length;

// Initialise les bordures des cases du labyrinthe
for (var y=0; y < size_y ; y++)
{
	for (var x=0; x < size_x ; x++)
	{
		setCaseBorders(x, y, td_elements[x+y*(size_y-2)]);
	}
}

// Initialise à false le tableau des cases sur lesquelles la souris est déjà passée
for (var i=0; i < size_x*size_y ; i++)
{
	tab_case_checked[i] = false;
}




///////////////
/// FONCTIONS
///////////////

// Retourne un entier entre a et b
function rand(a, b)
{
	return Math.floor( Math.random() * (b-a+1)) + a;
}

// Applique les classes 'u' 'd' 'l' 'r' à une case pour l'affichage de ses bordures dans le labyrinthe
function setCaseBorders(x, y, td_element)
{
	td_element.setAttribute("class","");
	var case_border = tab_labyrinthe[y][x];
	
	if (case_border - RIGHT >= 0)
	{
		td_element.className += 'r ';
		case_border -= RIGHT;
	}
	
	if (case_border - LEFT >= 0)
	{
		td_element.className += 'l ';
		case_border -= LEFT;
	}
	
	if (case_border - DOWN >= 0)
	{
		td_element.className += 'd ';
		case_border -= DOWN;
	}
	
	if (case_border - UP >= 0)
	{
		td_element.className += 'u ';
		case_border -= UP;
	}
}

// Déplace la souris si possible
function move(direction)
{
	switch (direction)
	{
		case UP:
			if (wall(UP))
			{
				return false;
			}
			else
			{
				pos_y--;
			}
		break;
		
		case DOWN:
			if (wall(DOWN))
			{
				return false;
			}
			else
			{
				pos_y++;
			}
		break;
		
		case LEFT:
			if (wall(LEFT))
			{
				return false;
			}
			else
			{
				pos_x--;
			}
		break;
		
		case RIGHT:
			if (wall(RIGHT))
			{
				return false;
			}
			else
			{
				pos_x++;
			}
		break;
	}
	refresh();
	return true;
}

// Vérifie si la case actuelle a déjà été checkée
function case_checked()
{
	return tab_case_checked[pos_x+pos_y*size_x];
}

// Vérifie qu'il y a un mur ou non à la case actuelle dans la direction demandée
function wall(direction)
{
	// Si c'est une extrémité du labyrinthe
	if (	(pos_x == 0 && direction == LEFT)
		 || (pos_y == 0 && direction == UP)
		 || (pos_x == size_x-1 && direction == RIGHT)
		 || (pos_y == size_y-1 && direction == DOWN))
	{
		return true; // Extrémité = mur
	}
	
	var position_now = tab_labyrinthe[pos_y][pos_x];
	
	if (position_now - RIGHT >= 0)
	{
		position_now -= RIGHT;
		if (direction == RIGHT)
			return true;
	}
	
	if (position_now - LEFT >= 0)
	{
		position_now -= LEFT;
		if (direction == LEFT)
			return true;
	}
	
	if (position_now - DOWN >= 0)
	{
		position_now -= DOWN;
		if (direction == DOWN)
			return true;
	}
	
	if (position_now - UP >= 0)
	{
		if (direction == UP)
			return true;
	}
	
	return false;
}

// Place aléatoirement le fromage dans le labyrinthe
function placeCheese()
{
	cheese_x = rand(0,size_x-1);
	cheese_y = rand(0,size_y-1);
	td_elements[cheese_x+cheese_y*size_x].setAttribute("id","cheese");
}

// Place aléatoirement la souris dans le labyrinthe
function placeMouse()
{
	pos_x = rand(0,size_x-1);
	pos_y = rand(0,size_y-1);
	td_elements[pos_x+pos_y*size_x].setAttribute("id","mouse");
	check_position();
}

// Vérifie que le fromage est sur cette case
function success()
{
	if (pos_x == cheese_x && pos_y == cheese_y)
		return true;
	else
		return false;
}

// Fonction principale
function seek_cheese()
{
	check_position();
	for (var dir=1; dir<=8 ; dir*=2) // UP, DOWN, LEFT then RIGHT
	{
		if (move(dir))
		{
			if (case_checked()) // Si la case est déjà visitée
				move(opposit_direction(dir)); // On annule le mouvement
			else
			{
				if (success())
				{
					document.getElementById('txt_success').style.visibility = "visible";
					return true;
				}
				else
				{
					check_position();
					if (confirm("OK pour continuer"))
					{
						if (seek_cheese())
							return true;
						else
							move(opposit_direction(dir));
					}
				}
			}
		}
	}
	return;
}

// Retourne la direction opposée de celle en paramètre
function opposit_direction(direction)
{
	switch (direction)
	{
		case UP:
		return DOWN;
		
		case DOWN:
		return UP;
		
		case RIGHT:
		return LEFT;
		
		case LEFT:
		return RIGHT;
		
		default:
		return;
	}
}

// Raffraichit l'affichage à l'écran
function refresh()
{
	for (var y=0; y < size_y ; y++)
	{
		for (var x=0; x < size_x ; x++)
		{
			
			if (x == pos_x && y == pos_y)
				td_elements[x+y*size_x].setAttribute("id","mouse");
			else if (x == cheese_x && y == cheese_y)
				td_elements[x+y*size_x].setAttribute("id","cheese");
			else
				td_elements[x+y*size_x].removeAttribute("id");
			
			// Ajoute ou retire la classe 'checked'
			if (td_elements[x+y*size_x].className.indexOf('checked ') != -1 && tab_case_checked[x+y*size_x] == false)
			{
				td_elements[x+y*size_x].className = td_elements[x+y*size_x].className.replace('checked ','');
			}
			if (td_elements[x+y*size_x].className.indexOf('checked ') == -1 && tab_case_checked[x+y*size_x] == true)
			{
				td_elements[x+y*size_x].className += 'checked ';
			}
		}
	}
}

// Retourne si on est déjà passé sur la case
function check_position()
{
	tab_case_checked[pos_x+pos_y*size_x] = true;
	
	if (td_elements[pos_x+pos_y*size_x].className.indexOf('checked ') == -1)
		td_elements[pos_x+pos_y*size_x].className += "checked ";
}

// Fonction de pause
function sleep(milliseconds)
{
	return ms(milliseconds);
}
// Fonction utilisée uniquement par sleep()
function ms()
{
	var milliseconds = 100;
	var start = new Date().getTime();
	while (true)
	{
		if ((new Date().getTime() - start) > milliseconds)
		{
			return milliseconds;
		}
	}
}

function reset_check()
{
	for (var i=0; i < size_x*size_y ; i++)
	{
		tab_case_checked[i] = false;
	}
	refresh();
	document.getElementById('txt_success').style.visibility = "hidden";
}





/////////////////////
/// CODE PRINCIPAL
/////////////////////

// Place le fromage et le point de départ de la souris
placeCheese();
placeMouse();