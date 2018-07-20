# bulls-and-cows-ghp

A simple idea inspired by [this](https://leetcode.com/problems/bulls-and-cows/description/) Leetcode problem.

See how to play [here](https://en.wikipedia.org/wiki/Bulls_and_Cows) (or read the instructions at the demo page).

See the live demo [here](https://www.weaverdyl.com/bulls-and-cows-ghp/).

## An example game:

![image](https://i.imgur.com/Nw0jjJE.png)

#### My Thought Process Throughout:
1. I start with a random guess. I generally guess distinct numbers to start.
	1. I got 1 cow. This means there is a 5, 6, 7, or 8 in the number, but whatever number it is, it's in the wrong place.
2. I chose another random number with distinct digits to get more information.
	1. I get 2 bulls. 2 of the numbers are in the correct place. This is good, but I need to know which numbers they are.
3. I make a guess that the numbers that are in the correct place is 2 and 5.
	1. Turns out that neither 2 nor 5 are in the number at all. This is huge, because it proves that 1 and 3 are in the correct place.
		1. The number is of the form _ _ 1 3
4. Remembering the cow that we got in our first guess, we know that one of {5, 6, 7, 8} is in the first 2 digits of our number. I guess that it's 6. 
	1. I isolate the results by filling in the rest of the number with numbers that I know aren't in the secret number.
	2. 6 is proven to be a bull, so our number is of the form 6 _ 1 3
5. I make a guess that the last digit is a 1.
	1. It was, and I won!

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.