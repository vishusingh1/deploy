## USER CODE


Just before the return render function inside a react component, if we see the following comment: we will take the code between the two comments and place it in the modelnode as a user-code tag. Make sure to not add anything at the end.

We use endsWith to find out start and end
LINES.findIndex(l=>l.trim().endsWith("b@user-code")); 

// USER CODE - Extra code written by user
// b@user-code

// b@user-code-end