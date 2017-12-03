#!/usr/bin/env python3
from os.path import isfile
import sys


def read_contract(path):
    result = ''
    with open(path) as f:
        lines = f.readlines()
        dependencies = [path.rsplit('/', maxsplit=1)[0] + line.strip().split()[1][2:-2]
                        for line in lines if line.strip().startswith('import')]
        code = ''.join([line for line in lines
                       if not (line.strip().startswith('import') or line.strip().startswith('pragma'))])
    for dependency in dependencies:
        result += read_contract(dependency)
    result += code
    return result

if __name__ == '__main__':
    if len(sys.argv) != 2:
        exit('Error: Target contract name should be specified as argument.')
    if not isfile(sys.argv[1]):
        exit('Error: Target contract was not found.')

    with open('build/contract.sol', 'w') as out:
        with open(sys.argv[1]) as f:
            pragma = f.readlines()[0]
            if not pragma.startswith('pragma'):
                exit('Error: Target contract first line should contain pragma')
        out.write(pragma)
        out.write(read_contract(sys.argv[1]))
