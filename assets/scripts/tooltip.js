"use strict";

/**
 * Fichier permettant de définir le texte à afficher dans l'infobulle.
 */


/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées au cercle survollé par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d) {
  // TODO: Retourner le texte à afficher dans l'infobulle selon le format demandé.
  //       Assurez-vous d'utiliser la fonction "formatNumber" pour formater les nombres correctement.
  var formatDecimalComma = d3.format(",.2f");
  return "Ticker: <b>" + d.data.key + "</b></br>QMV: <b>" + formatDecimalComma(d.data.value) + "$<b>";
}
