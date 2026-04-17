const fs = require('fs');
const path = '/home/ubuntu/apps/tiffany-models-academy/src/app/jadwal/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix rendering of the modal part
content = content.replace('        )}', '        </motion.div>\n        )}\n      </AnimatePresence>\n\n    </div>\n  );\n}');
content = content.replace('      </AnimatePresence>\n\n    </div>\n  );\n}\n      </AnimatePresence>\n\n    </div>\n  );\n}', '      </AnimatePresence>\n\n    </div>\n  );\n}');

fs.writeFileSync(path, content);
