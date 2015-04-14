<?php 

$fh = fopen("sass/colores.txt", "r");
while($line = fgetcsv($fh, 1000, ";")) {
   $label = $line[0];
   $valor = $line[1];
   $colores[$label] = $valor;
   

}



?>




<html>
  <head>
    <meta name="generator" content="HTML Tidy for HTML5 (experimental) for Windows https://github.com/w3c/tidy-html5/tree/c63cc39" />
    <title>Colores</title>
    <style>
      body {
        background:<?php print($colores['bk_body']);?>;
        color:<?php print($colores['general']);?>;
        font-family:arial;
        font-size:100%;
      }
      
      ul.colores li {

          border:1px solid <?php print($colores['general']);?>
          
        
      }
      input[type='text'] {
        background:<?php print($colores['bk_body']);?>;
        border:1px solid <?php print($colores['bk']);?>;
        color:<?php print($colores['general']);?>
      }
      <?php
foreach($colores as $val => $color) {
  print(".$val {
    background:$colores[$val];
  }");
  

  
  
  
}

?>
    </style>
    
    <link href="css/colores.css" rel="stylesheet" type="text/css">
    
    
  </head>
  <body>
  <div style="clear:both"></div>
<br/>
<?php
if ($_POST) {
    // echo '<pre>';
    // echo htmlspecialchars(print_r($_POST['colores'], true));
    
     // echo $colores['general'];
    // echo '</pre>';
    $fichero_colores = 'sass\colores.txt';
    $colores_bd = NULL;
    

    foreach($_POST['colores'] as $val => $color) {
      $colores_bd .= "$val;$color\n";
      
    }
    file_put_contents($fichero_colores, $colores_bd);
    
}
?>
<form action="" method="post">
       <input type="submit" value="submit me!" />

<?php

print ("<ul class='colores'>");
foreach($colores as $val => $color) {
  print("<li class='$val'>");
  print("<div class=titulo-color>" . $val . "</div>");
  print("<br/>");
  print("<input type='text' name='colores[$val]' value='$colores[$val]'/>");
  print("</li>");
  
  
  
}
print ("</ul>");
?>
</form>

<?php
$fichero = 'sass\_variables.scss';

// Abre el fichero para obtener el contenido existente
$actual = "// COLORES \n";

// Añade una nueva persona al fichero

foreach($colores as $val => $color) {

  
$actual .= "$$val:$colores[$val]; \n"  ;

  
  
  
}



// Escribe el contenido al fichero
file_put_contents($fichero, $actual);

?>

  </body>
</html>
