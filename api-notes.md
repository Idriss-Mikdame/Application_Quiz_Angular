# Notes sur l'API OpenTDB

## Endpoints principaux

- **Récupérer des questions**: `https://opentdb.com/api.php?amount=10`
- **Récupérer un jeton de session**: `https://opentdb.com/api_token.php?command=request`
- **Réinitialiser un jeton de session**: `https://opentdb.com/api_token.php?command=reset&token=YOURTOKENHERE`
- **Liste des catégories**: `https://opentdb.com/api_category.php`
- **Nombre de questions par catégorie**: `https://opentdb.com/api_count.php?category=CATEGORY_ID_HERE`
- **Nombre total de questions**: `https://opentdb.com/api_count_global.php`

## Paramètres disponibles

- **amount**: Nombre de questions (maximum 50)
- **category**: ID de la catégorie (9-32)
- **difficulty**: Niveau de difficulté (easy, medium, hard)
- **type**: Type de question (multiple, boolean)
- **encode**: Format d'encodage (default, urlLegacy, url3986, base64)
- **token**: Jeton de session pour éviter les questions répétées

## Catégories disponibles

```json
{
  "trivia_categories": [
    {"id": 9, "name": "General Knowledge"},
    {"id": 10, "name": "Entertainment: Books"},
    {"id": 11, "name": "Entertainment: Film"},
    {"id": 12, "name": "Entertainment: Music"},
    {"id": 13, "name": "Entertainment: Musicals & Theatres"},
    {"id": 14, "name": "Entertainment: Television"},
    {"id": 15, "name": "Entertainment: Video Games"},
    {"id": 16, "name": "Entertainment: Board Games"},
    {"id": 17, "name": "Science & Nature"},
    {"id": 18, "name": "Science: Computers"},
    {"id": 19, "name": "Science: Mathematics"},
    {"id": 20, "name": "Mythology"},
    {"id": 21, "name": "Sports"},
    {"id": 22, "name": "Geography"},
    {"id": 23, "name": "History"},
    {"id": 24, "name": "Politics"},
    {"id": 25, "name": "Art"},
    {"id": 26, "name": "Celebrities"},
    {"id": 27, "name": "Animals"},
    {"id": 28, "name": "Vehicles"},
    {"id": 29, "name": "Entertainment: Comics"},
    {"id": 30, "name": "Science: Gadgets"},
    {"id": 31, "name": "Entertainment: Japanese Anime & Manga"},
    {"id": 32, "name": "Entertainment: Cartoon & Animations"}
  ]
}
```

## Format de réponse

```json
{
  "response_code": 0,
  "results": [
    {
      "type": "multiple",
      "difficulty": "hard",
      "category": "History",
      "question": "When did Lithuania declare independence from the Soviet Union?",
      "correct_answer": "March 11th, 1990",
      "incorrect_answers": [
        "December 25th, 1991",
        "December 5th, 1991",
        "April 20th, 1989"
      ]
    },
    // Plus de questions...
  ]
}
```

## Codes de réponse

- **0**: Success - Retour réussi des résultats
- **1**: No Results - Pas assez de questions disponibles
- **2**: Invalid Parameter - Paramètre invalide
- **3**: Token Not Found - Jeton de session inexistant
- **4**: Token Empty - Toutes les questions possibles ont été utilisées
- **5**: Rate Limit - Trop de requêtes (limite: une requête toutes les 5 secondes)

## Limitations

- Une seule catégorie par requête
- Maximum 50 questions par requête
- Les jetons de session expirent après 6 heures d'inactivité
