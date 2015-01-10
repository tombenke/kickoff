/**
 * A sample plugin that converts context data to configuration file
 * @param  {[type]} contents  It is a string that holds the original content of the file,
 *                            that is actually this source file
 * @param  {[type]} ctx      `ctx` is the context data that was loaded from the `TestPanel.yml` file
 * @return {[type]}           return with a String that you want to be written into the target file
 */
module.exports = function(contents, ctx) {

    // You can change the content here before writing out

    return JSON.stringify(ctx, null, ' ');
};