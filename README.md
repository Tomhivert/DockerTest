#DockerTest
This is an API for the management of posts(HackerNoon-like).

The algorithm used for the score calculation is as such:
every post has a starting score of 5.
whenever a score is recalculated, the score value is the original score(5) + votes divided by the number of hours since the post was uploaded.
example:
for a post added 3 hours ago, that recieved 4 upvotes and 1 downvote:
5 (original) + 3(4 up + 1 down) / 3 = 2.67

In my algorithm, for a post to keep a high score and stay at the top of the list, it must continually recieve a flow of upvotes, otherwise the time factor will weigh it down.

scores are recalculated upon upvoting/downvoting any post, or creating a new post.

My top 10 list, comprises of entries that keep an instance of the original post, with the score and votes values.
every time a post is created or an upvote/downvote is made, the new/updated post's score get's compared with the top 10 list, and if the score is higher, replaced with the one with the lowest score.
