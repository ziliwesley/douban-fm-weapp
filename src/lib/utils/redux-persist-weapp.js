/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-11-19
 * @author Liang <liang@maichong.it>
 * @see  https://github.com/maichong/labrador-storage
 */

import wx from '../wx.js';

export default {

  /**
   * @param key
   * @param callback
   * @returns {*}
   */
  async getItem(key, callback) {
    try {
      let res = await wx.getStorage({ key });
      if (callback) callback(null, res.data);
      return res.data;
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  },

  /**
   * @param key
   * @param data
   * @param callback
   */
  async setItem(key, data, callback) {
    try {
      await wx.setStorage({ key, data });
      if (callback) callback(null);
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  },

  /**
   * @param key
   * @param callback
   */
  async removeItem(key, callback) {
    try {
      await wx.removeStorage({ key });
      if (callback) callback(null);
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  },

  /**
   * @param callback
   */
  async clear(callback) {
    wx.clearStorage();
    if (callback) callback(null);
  },

  /**
   * @param callback
   */
  async getAllKeys(callback) {
    try {
      let res = await wx.getStorageInfo();
      if (callback) callback(null, res.keys);
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  }
};
