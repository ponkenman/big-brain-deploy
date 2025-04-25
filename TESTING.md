For the second test, to be different from the happy path test, we went through the admin attempting to log in with invalid credentials, as well as how game questions could be edited. We decided not to test the player's route as it was practically difficult to stub the backend responses, especially since the serve was being polled every second. We also wanted to focus on the behaviour of the front end rather than test behaviours that relied primarily on the backend.

The second path involves:
- testing whether error produced on invalid credentials
- uploading a game from json file 
- verifying that game has correct details (questions, answers)
- exploring whether edit question and edit answer forms were responsive by changing question type, number of answers, different values, uploading images
