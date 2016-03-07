///////////////
/// VARIABLES
///////////////

// Enumerations equivalent
var UP=1, DOWN=2, LEFT=4, RIGHT=8;

// Labyrinth description
var tab_labyrinth;
	
// Checked cases are cases the mouses has already been (true or false)
var tab_case_checked = new Array();

// Array containing all td labyrinth's td elements
var td_elements = document.getElementsByTagName('td');

// Mouse and cheese's positions
var pos_x, cheese_x;
var pos_y, cheese_y;

// Labyrinthe's size
var size_x;
var size_y;

// history of moves
var stack = new Array();


/////////////////////////////////
/// VARIABLES INITIALISATIONS
/////////////////////////////////

tab_labyrinth =
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

size_x = tab_labyrinth[0].length;
size_y = tab_labyrinth.length;

// Displays the labyrinth's borders (walls)
for (var y=0; y < size_y ; y++)
{
	for (var x=0; x < size_x ; x++)
	{
		setCaseBorders(x, y, td_elements[x+y*(size_y-2)]);
	}
}

// Fills the checked cases with false statement
for (var i=0; i < size_x*size_y ; i++)
{
	tab_case_checked[i] = false;
}

// Initialisation of the positions
placeCheese();
placeMouse();


///////////////
/// FUNCTIONS
///////////////

// Main function
function seek_cheese()
{
	if (success())
	{
		document.getElementById('txt_success').style.visibility = "visible";
		return;
	}
	
	var ok = false;
	check_position();
	for (var dir=1; dir<=8 && ! ok ; dir*=2) // UP, DOWN, LEFT then RIGHT
	{
		if (move(dir))
		{
			if (case_checked()) // If case already visited...
				move(opposit_direction(dir)); // ...cancel the move
			else
			{
			  ok = true;
			  stack.push(dir)
				if (success())
				{
					document.getElementById('txt_success').style.visibility = "visible";
				}
				else
				{
					check_position();
				}
			}
		}
	}
	
	if(! ok)
	move(opposit_direction(stack.pop()));
}

// Returns an integer between a et b
function rand(a, b)
{
	return Math.floor( Math.random() * (b-a+1)) + a;
}

// Set the classes 'u' 'd' 'l' 'r' to each case for having the borders
function setCaseBorders(x, y, td_element)
{
	td_element.setAttribute("class","");
	var case_border = tab_labyrinth[y][x];
	
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

// Moves the mouse if possible (returns true when success, else false)
function move(direction)
{
	switch (direction)
	{
		case UP:
			if (wall(UP))
				return false;
			else
				pos_y--;
		break;
		
		case DOWN:
			if (wall(DOWN))
				return false;
			else
				pos_y++;
		break;
		
		case LEFT:
			if (wall(LEFT))
				return false;
			else
				pos_x--;
		break;
		
		case RIGHT:
			if (wall(RIGHT))
				return false;
			else
				pos_x++;
		break;
	}
	refresh();
	return true;
}

// Returns if the actual case has already been visited (true/false)
function case_checked()
{
	return tab_case_checked[pos_x+pos_y*size_x];
}

// Returns if there's a wall at the actual position in the paramater's direction
function wall(direction)
{
	// Labyrinth's extremes
	if (	(pos_x == 0 && direction == LEFT)
		 || (pos_y == 0 && direction == UP)
		 || (pos_x == size_x-1 && direction == RIGHT)
		 || (pos_y == size_y-1 && direction == DOWN))
	{
		return true; // Extremity = wall
	}
	
	var position_now = tab_labyrinth[pos_y][pos_x];
	
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

// Places the cheese at random position in the labyrinth
function placeCheese()
{
	cheese_x = rand(0,size_x-1);
	cheese_y = rand(0,size_y-1);
	td_elements[cheese_x+cheese_y*size_x].setAttribute("id","cheese");
}

// Places the mouse at random position in the labyrinth
function placeMouse()
{
	do
	{
		pos_x = rand(0,size_x-1);
		pos_y = rand(0,size_y-1);
	} while (pos_x == cheese_x && pos_y == cheese_y);
	
	td_elements[pos_x+pos_y*size_x].setAttribute("id","mouse");
}

// Returns if the mouse's position equals the cheese's position (true/false)
function success()
{
	if (pos_x == cheese_x && pos_y == cheese_y)
		return true;
	else
		return false;
}

// Returns the opposit direction
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
	}
}

// Refresh the HTML properties (class, id) for having the screen updated
function refresh()
{
	for (var y=0; y < size_y ; y++)
	{
		for (var x=0; x < size_x ; x++)
		{
			var elem = td_elements[x+y*size_x];
			
			if (x == pos_x && y == pos_y)
				elem.setAttribute("id","mouse"); // Mouse
			else if (x == cheese_x && y == cheese_y)
				elem.setAttribute("id","cheese"); // Cheese
			else
				elem.removeAttribute("id");
			
			// Adds or takes away the '.checked' class
			if (elem.className.indexOf('checked ') != -1 && tab_case_checked[x+y*size_x] == false)
			{
				elem.className = elem.className.replace('checked ','');
			}
			else if (elem.className.indexOf('checked ') == -1 && tab_case_checked[x+y*size_x] == true)
			{
				elem.className += 'checked ';
			}
		}
	}
}

// Checks the actual position as visited
function check_position()
{
	tab_case_checked[pos_x+pos_y*size_x] = true;
	
	if (td_elements[pos_x+pos_y*size_x].className.indexOf('checked ') == -1)
		td_elements[pos_x+pos_y*size_x].className += "checked ";
}

// Reset the checked positions
function reset_check()
{
	for (var i=0; i < size_x*size_y ; i++)
	{
		tab_case_checked[i] = false;
	}
	refresh();
	
	 // Hides the success text
	document.getElementById('txt_success').style.visibility = "hidden";
}

