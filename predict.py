import pandas as pd
import numpy as np
import json
import re
import sys
from sklearn.externals import joblib

def cleanResume(resumeText):
    resumeText = re.sub('http\S+\s*', ' ', resumeText)  # remove URLs
    resumeText = re.sub('RT|cc', ' ', resumeText)  # remove RT and cc
    resumeText = re.sub('#\S+', ' ', resumeText)  # remove hashtags
    resumeText = re.sub('@\S+', '  ', resumeText)  # remove mentions
    resumeText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', resumeText)  # remove punctuations
    resumeText = re.sub(r'[^\x00-\x7f]',r' ', resumeText) 
    resumeText = re.sub('\s+', ' ', resumeText)  # remove extra whitespace
    return resumeText

joblib_model = joblib.load('joblib_model.pkl')

skills_df = pd.read_csv('skills.csv',header=0)
skills_df.drop('s',axis=1,inplace=True)
skill_list = list(skills_df['Skills'])

cleanedData = sys.stdin.readlines()
data = cleanedData[0]
data = json.loads(data)

data = cleanResume(data['text'])
arr = np.array([data])
WordFeatures = joblib_model[1].transform(arr)

cat = joblib_model[0].predict(WordFeatures)
d = dict(zip(joblib_model[2].transform(joblib_model[2].classes_),joblib_model[2].classes_))

x = list()
for s in range(len(skill_list)):
    r = re.findall(r"" + re.escape(skill_list[s]) + r"",data)
    if(r!=[]):
        r = list(set(r))
        for a in r:
            x.append(a)

con = { "category": d[1], "skills" :x }
result = json.dumps(con)
print(result)