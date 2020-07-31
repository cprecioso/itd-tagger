/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.yaml" {
  declare const data: any
  export default data
}
