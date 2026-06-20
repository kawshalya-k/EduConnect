const gamification = require('./routes/GamificationRoutes');
const sessions = require('./routes/sessionRoutes');
const wallet = require('./routes/WalletRoutes');

function listRoutes(router){
  const paths = [];
  router.stack.forEach((layer)=>{
    if(layer.route && layer.route.path){
      paths.push(layer.route.path);
    }
  });
  return paths;
}

console.log('gamification routes:', listRoutes(gamification));
console.log('session routes:', listRoutes(sessions));
console.log('wallet routes:', listRoutes(wallet));
