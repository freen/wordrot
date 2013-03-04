Technical Flow of Play
======================

A high level drawing out of the technical flow of the gameplay.

Data and Data Models
--------------------

### API Data
  
  - API Words and API Lists will not have parallel database records or Doctrine
    Entities
  - They'll be referred to in application Entities via their 3rd-party API IDs

### Data Relationships

  - Record User has many Lists
  - List has many Words (& vice versa)
  - Record Game
    - has one List (its source of Words)
    - has many Plays
    - is active (current) or inactive (former and complete)
    - when all of the Words in the associated List have a Play which has an
      Answer, the Game is complete
  - Record Play
    - has one game
    - has only one Answer or no Answer
      - the Play lacking an Answer is the current, pending Play
      - therefore, only one Play per Game can lack an Answer

API Response Caching
--------------------

  - Not stored in DB as parallel data sets, but referred to via third party IDs
  - API response caching strategy (lists and words) (rough draft)
    - File-system cache of serialized response objects
    - User Lists
	    - Expired & refreshed each login
	- List Words
	    - Expired & refreshed at the end of each game
	      - Thus the word list is stable throughout a game that is in progress

Steps
-----
  
### On Load

  - No User Lists?
    - Automatically create a List
  - No User Lists with Words?
    - Require the user to add at least two words to a List
  - No active Game?
    - Prompt user to start a new game using a List which has at least two words
  - No active Play?
    - Automatically create the next Play, selected from the Words, so far
      unused this Game, on the associated List
    - If all Words on this Game's List have been used, conclude the Game
  - Prompt the User to respond to the active Play