export enum EFFECT_TAG {
  /** 更新节点 */
  UPDATE = 'UPDATE',

  /** 插入节点 */
  PLACEMENT = 'PLACEMENT',

  /** 删除节点 */
  DELETION = 'DELETION',

  /** 插入和更新节点 */
  PLACEMENT_AND_UPDATE = 'PLACEMENT_AND_UPDATE',

  /** 内容重置 */
  CONTENT_RESET = 'CONTENT_RESET',
}

export enum ELEMENT_TYPE {
  /** 文本节点 */
  TEXT_ELEMENT = 'TEXT_ELEMENT',
}
