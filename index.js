var Route53 = require('nice-route53');
var assert = require('assert');
var request = require('superagent');

assert(process.env.AWS_ACCESS_KEY_ID, 'AWS_ACCESS_KEY_ID env var must be set');
assert(process.env.AWS_SECRET_ACCESS_KEY, 'AWS_SECRET_ACCESS_KEY env var must be set');
assert(process.env.ZONE_ID, 'ZONE_ID env var must be set, see route53 console');
assert(process.env.DOMAIN, 'DOMAIN env var must be set, e.g. home.me.com');

getIp(setIp);

function getIp(cb) {
    console.log('getting ip');

    request.get('http://ipinfo.io/ip')
        .end(function (err, res) {
            if (err || !res.ok) {
                console.error('could not get ip');
            } else {
                setIp(res.text);
            }
        })
}

function setIp(ip) {
    console.log('setting ip to', ip);

    var r53 = new Route53({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    var args = {
        zoneId: process.env.ZONE_ID,
        name: process.env.DOMAIN,
        type: 'A',
        ttl: 600,
        values: [ip],
    };

    r53.setRecord(args, function (err, res) {
        console.log('change submitted')
    });
}

