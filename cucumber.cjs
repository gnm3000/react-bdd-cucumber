module.exports = {
  default: {
    import: ['generated/node/features/step-definitions/**/*.js', 'generated/node/features/support/**/*.js'],
    format: ['progress', 'html:reports/cucumber-report.html'],
    paths: ['features/**/*.feature']
  }
};
