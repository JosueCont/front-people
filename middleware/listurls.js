import jobbank from './jobbank';
import assessments from './assessments';
import user from './user';

export const ignoreURLS = [
    '/',
    '/validation',
    '/403',
    '/500',
    '/404',
    '/select-company'
]

export const mapURLS = {
    'jobbank': jobbank,
    'assessments': assessments,
    'user': user
}