from __future__ import print_function
from urllib2 import Request, urlopen
import json

print('Loading function')

def lambda_handler(event, context):

    # setup request vars
    place = event["place"]
    category = event["category"]

    # get socrata data
    request = Request('http://api.us.socrata.com/api/catalog/v1?only=dataset&limit=10&q='+place+"%20"+category)
    response = urlopen(request)

    # convert response to python object
    response_content = json.loads(response.read())
    results_json = response_content["results"]

    # parse response results for dataset names
    dataset_names = []
    for result in results_json:
        dataset_names.append(result["resource"]["name"].encode("utf-8"))

    return json.dumps(dataset_names)
    #raise Exception('Something went wrong')
