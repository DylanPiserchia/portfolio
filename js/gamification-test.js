// GAMIFICATION SYSTEM - TEST SCRIPT
// Ejecuta esto en la consola del navegador (DevTools) para probar el sistema

console.log('%c🎮 Gamification System Test', 'font-size: 16px; font-weight: bold; color: #00d4ff;');
console.log('%c=' .repeat(50), 'color: #00d4ff;');

// 1. Verificar localStorage
console.log('\n📊 1. VERIFICAR LOCALSTORAGE:');
const savedData = localStorage.getItem('portfolio_data');
if (savedData) {
    console.log('✅ Datos guardados:', JSON.parse(savedData));
} else {
    console.log('⚠️  No hay datos guardados aún (primera vez)');
}

// 2. Verificar CSS cargado
console.log('\n🎨 2. VERIFICAR CSS CARGADO:');
const levelSystemCss = Array.from(document.styleSheets).find(sheet => 
    sheet.href && sheet.href.includes('level-system.css')
);
if (levelSystemCss) {
    console.log('✅ level-system.css cargado correctamente');
} else {
    console.log('❌ ERROR: level-system.css NO encontrado');
}

// 3. Verificar elementos del DOM
console.log('\n🏗️  3. VERIFICAR ELEMENTOS DEL DOM:');
const levelContainer = document.querySelector('.level-container');
const levelBadge = document.querySelector('.level-badge');
const xpBar = document.querySelector('.xp-bar');
const navbarPlaceholder = document.getElementById('navbar-placeholder');

console.log(levelContainer ? '✅ .level-container encontrado' : '❌ .level-container NO encontrado');
console.log(levelBadge ? '✅ .level-badge encontrado' : '❌ .level-badge NO encontrado');
console.log(xpBar ? '✅ .xp-bar encontrado' : '❌ .xp-bar NO encontrado');
console.log(navbarPlaceholder ? '✅ navbar-placeholder encontrado' : '❌ navbar-placeholder NO encontrado');

// 4. Verificar configuración de LEVEL_CONFIG
console.log('\n⚙️  4. CONFIGURACIÓN DEL SISTEMA:');
if (typeof LEVEL_CONFIG !== 'undefined') {
    console.log('✅ LEVEL_CONFIG definido:');
    console.log('  - xpPerPage:', LEVEL_CONFIG.xpPerPage);
    console.log('  - baseXP:', LEVEL_CONFIG.baseXP);
    console.log('  - storageKey:', LEVEL_CONFIG.storageKey);
} else {
    console.log('❌ ERROR: LEVEL_CONFIG NO está definido');
}

// 5. Verificar stats del usuario
console.log('\n👤 5. STATS DEL USUARIO:');
if (typeof userStats !== 'undefined') {
    console.log('✅ userStats definido:');
    console.log('  - XP Actual:', userStats.xp);
    console.log('  - Nivel:', userStats.level);
    console.log('  - Páginas Visitadas:', userStats.visitedPages);
} else {
    console.log('❌ ERROR: userStats NO está definido');
}

// 6. Verificar métodos de Navbar
console.log('\n📚 6. MÉTODOS DISPONIBLES DE NAVBAR:');
const requiredMethods = [
    'loadProgress',
    'saveProgress',
    'getXPForLevel',
    'addXP',
    'showXPNotification',
    'showLevelUpNotification',
    'updateLevelUI',
    'checkPageExperience',
    'createNavbar',
    'attachEventListeners',
    'setupActiveLink'
];

const navbarProto = Navbar.prototype;
requiredMethods.forEach(method => {
    if (typeof navbarProto[method] === 'function') {
        console.log(`✅ ${method}()`);
    } else {
        console.log(`❌ ${method}() NO ENCONTRADO`);
    }
});

// 7. Calcular XP para siguiente nivel
console.log('\n📈 7. CÁLCULO DE XP PARA NIVELES:');
for (let i = 1; i <= 5; i++) {
    const xpNeeded = i * LEVEL_CONFIG.baseXP;
    console.log(`  Nivel ${i} → Nivel ${i + 1}: ${xpNeeded} XP`);
}

// 8. Función de prueba: Agregar XP
console.log('\n🧪 8. FUNCIÓN DE PRUEBA - AGREGAR XP:');
console.log('Para agregar 50 XP, ejecuta: window.testAddXP(50)');
window.testAddXP = function(amount) {
    const navbar = new Navbar();
    navbar.addXP(amount);
    console.log(`✅ Se agregaron ${amount} XP`);
    console.log('Nuevo estado:', userStats);
};

// 9. Función de prueba: Limpiar datos
console.log('\n🧹 9. FUNCIÓN DE PRUEBA - LIMPIAR DATOS:');
console.log('Para resetear el progreso, ejecuta: window.testReset()');
window.testReset = function() {
    localStorage.removeItem('portfolio_data');
    userStats = { xp: 0, level: 1, visitedPages: [] };
    location.reload();
    console.log('✅ Progreso reseteado');
};

console.log('\n%c=' .repeat(50), 'color: #00d4ff;');
console.log('%c✨ Test completado ✨', 'font-size: 14px; font-weight: bold; color: #00ff88;');
console.log('\n💡 Comandos disponibles:');
console.log('  • window.testAddXP(25)  → Agregar 25 XP');
console.log('  • window.testReset()    → Resetear progreso');
console.log('  • console.table(userStats) → Ver stats formateado');
