import jobbank from './modules/jobbank';
import assessments from './modules/assessments';
import user from './modules/user';
import payroll from './modules/payroll';

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
    'user': user,
    'payroll': payroll
}