### Extracting Words In A String Without Spaces

Words in a domain required be extracted to obtain word2vec models. Because domain name does not include space it is just flat text. It needs to be separated into meaningful pieces. For example, "mybeautifuldomain.com" should be extracted into {"my", "beautiful", "domain"}. Moreover, this algorithm needs to be very efficient because it needs process huge number of domain and it search contained words in a set number of language with huge word corpus. Thus, dynamic programming has been used to determine best string matching with a dictionary which contains words in a set of languages with their frequency in this language. Also, detect the language of domains has been detected by that.

This domain word extraction implemented under parser module with `WordExtractor` class

```python
separator = WordExtractor()
```

It separate correctly words and predicts range of language.

```python
list(separator.predict([
    'mybeautifulname', 
    'benimguzelismim',
    'meinschonname',
    'mojepiekneimie',
    'mijnmooienaam',
    'monbeaunom',
    'minombrebello',
    'ilmiobelnome'
]))

# Output:
# [('english', 'my beautiful name'),
# ('turkish', 'benim guzel ismim'),
# ('german', 'mein schon name'),
# ('polish', 'moje piekne imie'),
# ('dutch', 'mijn mooie naam'),
# ('french', 'mon beau nom'),
# ('spanish', 'mi nombre bello'),
# ('italian', 'il mio bel nome')]
```

It stores a huge number of word in a dictionary which keys are word and values is set which includes language and its frequency in this language. For example, `beautiful` have seen different languages corpus but it is most probably English because it's frequency differences.

```python
separator._words_lang['beautiful']

# Output:
# {('dutch', 1e-06),
#  ('english', 0.000299),
#  ('french', 2e-06),
#  ('german', 2e-06),
#  ('italian', 2e-06),
#  ('polish', 2e-06),
#  ('spanish', 1e-06)}
```

Then check the frequencies.

```python
import matplotlib.pyplot as plt
import pandas

pandas.Series(dict(separator._words_lang['beautiful'])).plot(kind='bar')
plt.show()
```

![png](/assets/img/extraction-words.png)

```python
from collections import defaultdict

query = 'mybeautifulname'

for i in range(len(query)):
    for j in range(i + 1, len(query) + 1):
        subquery = query[i:j]
        if subquery in separator._words_lang:
            for lang in separator._words_lang[subquery]:
                if len(subquery) != 1:
                    print(subquery, i , j, lang)

# Output:
# my 0 2 ('polish', 0.00065)
# my 0 2 ('german', 3.8e-05)
# ...
# be 2 4 ('turkish', 0.000291)
# be 2 4 ('dutch', 1.1e-05)
# be 2 4 ('polish', 2.8e-05)
# bea 2 5 ('english', 4e-06)
# ..
# beau 2 6 ('french', 0.000235)
# beau 2 6 ('english', 4e-06)
# ...
# beaut 2 7 ('english', 1e-06)
# beautiful 2 11 ('english', 0.000299)
...
```

Then possible words and their interval in query is obtained. Then problem caould be reduced to weighted interval scheduling. But more sophisticated weight matrix as below required to match more acquired results.

![svg](/assets/img/extracting-words-formula.svg)

Heuristic behind the upper term is  proprieties longer match over short match as `score('behind') >  score('be') + score('hind')` because shorter grams are commonly exist across languages. Intuition behind the lower term is using frequency property but log scale to keep less effective over other metrics.
