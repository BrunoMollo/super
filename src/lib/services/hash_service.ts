import type { Hash_Service } from "$lib/logic/ports/i-hash-service";
import bcrypt from "bcrypt"

export class Hash_Service_Bcrypt implements Hash_Service {

  async check(password: string, hash: string): Promise<{ pass: boolean }> {
    console.log({ password, hash })
    const pass = await bcrypt.compare(password, hash);
    return { pass };
  }

  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(9)
    const hash = bcrypt.hash(data, salt)
    return hash;
  }

}
