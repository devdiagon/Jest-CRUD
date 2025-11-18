const js = require('@eslint/js');

module.exports = [
  {
    // Excluir archivos de coverage
    ignores: ['coverage/**'],
  },
  {
    // Configuración para archivos que se van a validar
    files: ['src/**/*.js'],

    // Especificar el lenguaje de programación
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },

    // Reglas que eslint aplicará
    rules: {
      ...js.configs.recommended.rules,

      // Especificar reglas
      //    [ <que se devuelve>, <como se cumple> ]
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      eqeqeq: ['error', 'always', ],
      'no-console': ['error'],
      'prefer-const': ['error'],
      'no-var': ['error'],
      'comma-dangle': ['error','never'],
      'object-curly-spacing': ['error', 'always'],

    },
    
  },
]