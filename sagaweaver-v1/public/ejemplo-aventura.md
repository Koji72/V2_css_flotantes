# La Cripta Olvidada

:::setup | hidden
[[vardef:salud=100]]
[[vardef:monedas=0]]
[[vardef:tiene_llave=false]]
[[vardef:tiene_espada=false]]
[[vardef:tiene_antorcha=false]]
[[vardef:explorado_norte=false]]
[[vardef:explorado_sur=false]]
[[vardef:inventory=[]]]
:::

:::passage | id=inicio | tags=oscuro
# La Cripta Olvidada

La puerta de piedra se cierra detrás de ti con un estruendo. La oscuridad te envuelve mientras el eco se desvanece en las profundidades de la cripta.

El aire es frío y húmedo, con un olor persistente a tierra mojada y antigüedad. Tus ojos luchan por adaptarse a la penumbra.

[[choice: Buscar una fuente de luz | goto=buscar_luz | action=addItem('Pedernal')]]
[[choice: Avanzar a tientas | goto=avanzar_tientas | req=!tiene_antorcha]]
[[choice: Encender la antorcha | goto=entrada_principal | req=tiene_antorcha | action=setVar('tiene_antorcha',true)]]
:::

:::status-panel | id=stats | title="Estado"
**Salud:** [[bind:salud]]
**Monedas:** [[bind:monedas]]

**Inventario:**
<ul data-list-items="inventory"></ul>
:::

:::passage | id=buscar_luz | tags=oscuro
# En busca de luz

Palpas las paredes de piedra con cuidado. Tus dedos encuentran una pequeña repisa tallada donde descansa algo metálico. Es un pedernal.

También detectas lo que parece ser una antorcha gastada en un soporte de hierro.

[[choice: Tomar la antorcha y encenderla | goto=entrada_principal | action=addItem('Antorcha');setVar('tiene_antorcha',true)]]
[[choice: Continuar a oscuras | goto=avanzar_tientas]]
:::

:::passage | id=avanzar_tientas | tags=oscuro,peligro
# Avanzando en la oscuridad

Te mueves lentamente por el pasillo oscuro, con una mano siempre tocando la pared para orientarte.

De repente, tu pie no encuentra suelo. Intentas recuperar el equilibrio, pero caes por lo que parece ser un pozo.

[[if:tiene_antorcha | then=La caída es corta, pero dolorosa. Tu antorcha se apaga en el impacto. | else=La caída parece interminable en la absoluta oscuridad antes de golpear el suelo con un impacto sordo.]]

**¡Pierdes 15 puntos de salud!**

[[choice: Examinar tus heridas | goto=pozo | action=decreaseVar('salud',15)]]
:::

:::passage | id=entrada_principal | tags=iluminado
# La Entrada a la Cripta

La luz de tu antorcha revela una sala amplia con techos abovedados. Antiguos frescos, ahora descoloridos, decoran las paredes. Muestran escenas de guerreros y sacerdotes realizando algún tipo de ritual.

En el centro de la sala hay una estatua de piedra de un guerrero sosteniendo una espada. A sus pies yace una ofrenda de monedas de oro.

Hay pasajes que conducen al norte y al sur.

[[choice: Examinar la estatua | goto=estatua]]
[[choice: Tomar las monedas | goto=tomar_monedas | action=increaseVar('monedas',10)]]
[[choice: Ir al pasaje norte | goto=pasaje_norte | action=setVar('explorado_norte',true)]]
[[choice: Ir al pasaje sur | goto=pasaje_sur | action=setVar('explorado_sur',true)]]
:::

:::passage | id=estatua | tags=iluminado
# La Estatua del Guerrero

Te acercas a la estatua de piedra. Representa a un guerrero con armadura completa, sosteniendo una espada ceremonial. Sus ojos parecen seguirte.

Una inscripción en la base dice: "Solo los valientes y honestos encontrarán el camino".

La espada parece estar unida a la estatua, pero al tocarla notas que podría desprenderse.

[[choice: Intentar tomar la espada | goto=tomar_espada | action=setVar('tiene_espada',true);addItem('Espada antigua')]]
[[choice: Examinar las monedas | goto=tomar_monedas]]
[[choice: Volver a la entrada | goto=entrada_principal]]
:::

:::passage | id=tomar_espada | tags=iluminado,objeto
# La Espada del Guerrero

Con un suave tirón, la espada se desprende de las manos de la estatua. Para tu sorpresa, la piedra de la estatua parece cambiar ligeramente, como si el guerrero asintiera en aprobación.

La espada es más ligera de lo que parece, con runas grabadas en la hoja que brillan tenuemente a la luz de tu antorcha.

[[choice: Volver a la entrada | goto=entrada_principal]]
:::

:::passage | id=tomar_monedas | tags=iluminado,objeto
# Las Monedas de Oro

Te inclinas para recoger las monedas de oro a los pies de la estatua. Son antiguas, con símbolos que no reconoces.

Mientras las recoges, crees escuchar un leve suspiro de decepción emanando de la estatua.

[[choice: Examinar la estatua | goto=estatua | req=!tiene_espada]]
[[choice: Volver a la entrada | goto=entrada_principal]]
:::

:::passage | id=pasaje_norte | tags=iluminado,combate
# Pasaje Norte - La Cámara del Guardián

El pasaje se abre a una cámara circular con un techo alto. En el centro hay una figura esquelética en armadura oxidada, inmóvil pero claramente no natural.

Al entrar en la habitación, el esqueleto cruje al moverse y levanta una espada mellada.

[[choice: Enfrentarse al esqueleto | goto=combate_esqueleto | req=tiene_espada]]
[[choice: Huir de vuelta a la entrada | goto=entrada_principal | action=decreaseVar('salud',5)]]
:::

:::passage | id=combate_esqueleto | tags=iluminado,combate
# Combate contra el Guardián

El esqueleto avanza lentamente. Usando tu espada, logras bloquear sus ataques lentos pero poderosos.

Tras un combate breve pero intenso, logras desarmarlo y destruir al guardián no-muerto. Sus huesos caen al suelo sin vida.

Entre los restos encuentras una llave de hierro.

[[choice: Tomar la llave | goto=tomar_llave | action=setVar('tiene_llave',true);addItem('Llave de hierro')]]
[[choice: Volver a la entrada | goto=entrada_principal]]
:::

:::passage | id=tomar_llave | tags=iluminado,objeto
# La Llave de Hierro

Recoges la llave de entre los restos del esqueleto. Es pesada y antigua, con símbolos similares a los de tu espada grabados en ella.

Debe abrir algo importante dentro de la cripta.

[[choice: Volver a la entrada | goto=entrada_principal]]
:::

:::passage | id=pasaje_sur | tags=iluminado
# Pasaje Sur - La Cámara del Tesoro

El pasaje desciende ligeramente antes de abrirse a una pequeña cámara. En el centro hay un cofre de metal con elaborados grabados.

El cofre está cerrado con un mecanismo que parece requerir una llave.

[[choice: Intentar abrir el cofre | goto=abrir_cofre | req=tiene_llave]]
[[choice: Intentar forzar el cofre | goto=forzar_cofre | req=!tiene_llave]]
[[choice: Volver a la entrada | goto=entrada_principal]]
:::

:::passage | id=forzar_cofre | tags=iluminado,peligro
# Intentando Forzar el Cofre

Sin la llave adecuada, intentas forzar la cerradura. Al manipularla, un mecanismo oculto se activa, y pequeñas agujas envenenadas salen disparadas.

**¡Pierdes 30 puntos de salud!**

El cofre permanece cerrado y ahora parece más peligroso intentar abrirlo sin la llave.

[[choice: Volver a la entrada | goto=entrada_principal | action=decreaseVar('salud',30)]]
:::

:::passage | id=abrir_cofre | tags=iluminado,tesoro
# El Tesoro de la Cripta

La llave encaja perfectamente en la cerradura. Con un suave clic, el mecanismo se libera y el cofre se abre lentamente.

Dentro encuentras un pequeño tesoro: **50 monedas de oro** y un amuleto de plata con una gema azul.

[[choice: Tomar el tesoro | goto=final | action=increaseVar('monedas',50);addItem('Amuleto de plata')]]
:::

:::passage | id=pozo | tags=oscuro,trampa
# Atrapado en el Pozo

El dolor recorre tu cuerpo mientras evalúas la situación. Estás en el fondo de un pozo de unos tres metros de profundidad. Las paredes son rugosas y podrían escalarse con cuidado.

[[choice: Intentar escalar | goto=inicio | action=setVar('salud',85)]]
[[choice: Gritar pidiendo ayuda | goto=pozo_grito]]
:::

:::passage | id=pozo_grito | tags=oscuro,trampa
# Un Grito en la Oscuridad

Tu voz resuena en las paredes del pozo, pero no parece haber nadie que pueda escucharte. El eco de tu grito se desvanece dejando un silencio más profundo que antes.

Tras esperar un tiempo, te das cuenta que la única salida es intentar escalar.

[[choice: Intentar escalar | goto=inicio | action=setVar('salud',85)]]
:::

:::passage | id=final | tags=iluminado,fin
# Escapando de la Cripta

Con el tesoro en tu poder, decides que es momento de buscar la salida. Siguiendo tu instinto y la luz de tu antorcha, logras encontrar un pasaje ascendente que no habías visto antes.

Después de un largo recorrido, ves un rayo de luz natural al final del túnel. Has encontrado la salida.

Al emerger de la cripta, respiras profundamente el aire fresco mientras sostienes tu recompensa.

**Aventura completada**

[[choice: Volver a empezar | goto=inicio | action=setVar('salud',100);setVar('monedas',0);setVar('tiene_llave',false);setVar('tiene_espada',false);setVar('tiene_antorcha',false);setVar('explorado_norte',false);setVar('explorado_sur',false);setVar('inventory',[])]]
::: 