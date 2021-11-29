const cookieName = 'sso.jd.com';

const serversConfig = {
  dev: {
    core: 'http://test.datafocuscore.jd.com:8082',
    web: 'dev.datafocus.jd.com',
    report: 'http://report.jrm.jd.com',
    auth: 'http://test.auth.jrm.jd.com',
    login: 'http://test.ssa.jd.com/sso/login?ReturnUrl=',
    logout: 'http://test.ssa.jd.com/sso/logout?ReturnUrl=',
    token: '',
  },
  test: {
    core: 'http://test.datafocuscore.jd.com:8082',
    web: 'test.datafocus.jd.com',
    report: 'http://report.jrm.jd.com',
    auth: 'http://test.auth.jrm.jd.com',
    login: 'http://test.ssa.jd.com/sso/login?ReturnUrl=',
    logout: 'http://test.ssa.jd.com/sso/logout?ReturnUrl=',
    token: '',
  },
  pre: {
    core: 'https://precoredatafocus.jd.com',
    web: 'pre-datafocus.jd.com',
    report: 'http://report.jrm.jd.com',
    auth: 'http://auth.jrm.jd.com',
    login: 'http://ssa.jd.com/sso/login?ReturnUrl=',
    logout: 'http://ssa.jd.com/sso/logout?ReturnUrl=',
    token: '',
  },
  prod: {
    core: 'https://core-datafocus.jd.com',
    web: 'datafocus.jd.com',
    report: 'http://report.jrm.jd.com',
    auth: 'https://api-auth.jd.com',
    login: 'http://ssa.jd.com/sso/login?ReturnUrl=',
    logout: 'http://ssa.jd.com/sso/logout?ReturnUrl=',
    token: '',
  },
};

const servers = serversConfig[process.env.NODE_ENV];

export {
  servers,
  cookieName,
};
